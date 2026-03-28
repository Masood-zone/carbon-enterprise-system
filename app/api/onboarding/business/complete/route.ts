import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import type {
  BusinessOnboardingDraft,
  BusinessOnboardingTeamMember,
} from "@/services/onboarding/business-onboarding"

type CompleteBusinessOnboardingBody = {
  onboarding?: BusinessOnboardingDraft
}

function isValidTeamMemberRole(role: string) {
  return role === "ADMIN" || role === "MANAGER"
}

function sanitizeTeamMembers(
  members: BusinessOnboardingTeamMember[] | undefined
): BusinessOnboardingTeamMember[] {
  if (!Array.isArray(members)) {
    return []
  }

  return members
    .filter((member) => member.fullName.trim() && member.email.trim())
    .map((member) => ({
      fullName: member.fullName.trim(),
      email: member.email.trim().toLowerCase(),
      role: isValidTeamMemberRole(member.role) ? member.role : "MANAGER",
    }))
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompleteBusinessOnboardingBody
    const onboarding = body.onboarding

    if (
      !onboarding?.businessInfo ||
      !onboarding.financeSetup ||
      !onboarding.teamSetup
    ) {
      return NextResponse.json(
        { error: "Incomplete onboarding payload" },
        { status: 400 }
      )
    }

    const adminEmail = onboarding.teamSetup.adminEmail.trim().toLowerCase()
    const adminName = onboarding.teamSetup.adminName.trim()
    const teamMembers = sanitizeTeamMembers(onboarding.teamSetup.teamMembers)
    const businessInfo = onboarding.businessInfo
    const financeSetup = onboarding.financeSetup
    const location = [businessInfo.town.trim(), businessInfo.region.trim()]
      .filter(Boolean)
      .join(", ")

    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin email is required" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "Admin account was not found after sign up" },
        { status: 404 }
      )
    }

    const business = await prisma.$transaction(async (transaction) => {
      const createdBusiness = await transaction.business.create({
        data: {
          name: businessInfo.businessName.trim(),
          type: businessInfo.industry.trim(),
          location,
          currency: businessInfo.currency.trim() || "GHS",
          taxIdentificationNumber: financeSetup.tinNumber.trim(),
          onboardingCompleted: true,
          metadata: {
            onboardingSource: "business-onboarding",
            financeSetup: {
              bankName: financeSetup.bankName.trim(),
              accountNumber: financeSetup.accountNumber.trim(),
              tinNumber: financeSetup.tinNumber.trim(),
            },
            teamMembers,
            region: businessInfo.region.trim(),
            town: businessInfo.town.trim(),
          },
        },
      })

      await transaction.businessSettings.create({
        data: {
          businessId: createdBusiness.id,
          defaultForecastGranularity: "WEEKLY",
          forecastHorizonDays: 30,
          analyticsWindowDays: 90,
          lowStockThreshold: 10,
          reorderReviewIntervalDays: 7,
          stockoutAlertThreshold: 3,
          overstockAlertThreshold: 90,
          autoReorderEnabled: false,
          adaptiveInsightsEnabled: true,
          dashboardDefaults: {
            landingView: "forecast",
            showAdaptiveInsights: true,
          },
          analyticsConfig: {
            focus: ["sales", "inventory", "demand", "stockout-risk"],
          },
        },
      })

      await transaction.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          businessId: createdBusiness.id,
          role: "ADMIN",
          name: adminName || existingUser.name,
          lastActiveAt: new Date(),
        },
      })

      return createdBusiness
    })

    return NextResponse.json({
      ok: true,
      businessId: business.id,
      onboarding,
      userId: existingUser.id,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Onboarding failed"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
