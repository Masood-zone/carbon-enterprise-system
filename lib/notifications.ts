import {
  emailService,
  getAppName,
  getAppUrl,
  type WelcomeNotificationStep,
} from "@/lib/email-service"
import { isStrongPassword } from "@/lib/utils"

import { randomInt } from "node:crypto"

type BusinessLaunchWelcomeEmailArgs = {
  recipientEmail: string
  recipientName?: string
  businessName: string
  dashboardUrl?: string
}

type BusinessTeamMemberWelcomeEmailArgs = {
  recipientEmail: string
  recipientName?: string
  businessName: string
  role: "ADMIN" | "MANAGER"
  password: string
  dashboardUrl?: string
}

function buildBusinessLaunchSteps(
  businessName: string
): WelcomeNotificationStep[] {
  return [
    {
      title: "Review your workspace",
      description: `Your ${businessName} workspace is live and ready for your first review.`,
    },
    {
      title: "Invite the right people",
      description:
        "Add managers or operators who should help you run the business day to day.",
    },
    {
      title: "Start tracking operations",
      description:
        "Open the dashboard to monitor inventory, activity, and performance from one place.",
    },
  ]
}

function generateSecurePassword(length = 16): string {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lowercase = "abcdefghijkmnopqrstuvwxyz"
  const numbers = "23456789"
  const symbols = "!@#$%&*?"
  const alphabet = `${uppercase}${lowercase}${numbers}${symbols}`

  while (true) {
    const characters = [
      uppercase[randomInt(0, uppercase.length)],
      lowercase[randomInt(0, lowercase.length)],
      numbers[randomInt(0, numbers.length)],
      symbols[randomInt(0, symbols.length)],
    ]

    while (characters.length < length) {
      characters.push(alphabet[randomInt(0, alphabet.length)])
    }

    for (let index = characters.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(0, index + 1)
      const current = characters[index]
      characters[index] = characters[swapIndex]
      characters[swapIndex] = current
    }

    const password = characters.join("")
    if (isStrongPassword(password)) {
      return password
    }
  }
}

function buildTeamMemberSteps(
  businessName: string,
  role: "ADMIN" | "MANAGER"
): WelcomeNotificationStep[] {
  const roleLabel = role === "ADMIN" ? "administrator" : "manager"

  return [
    {
      title: "Use your secure password",
      description:
        "Sign in with the password in this email, then change it after your first login.",
    },
    {
      title: "Open your dashboard",
      description: `Access the ${businessName} workspace and review the tools available to a ${roleLabel}.`,
    },
    {
      title: "Keep the workspace moving",
      description:
        "Use the dashboard to stay on top of operations, inventory, and activity.",
    },
  ]
}

class NotificationsService {
  async sendBusinessLaunchWelcomeEmail(
    args: BusinessLaunchWelcomeEmailArgs
  ): Promise<void> {
    const appName = getAppName()
    const appUrl = getAppUrl()
    const businessName = args.businessName.trim()
    const dashboardUrl =
      args.dashboardUrl || `${appUrl.replace(/\/$/, "")}/dashboard`

    await emailService.sendWelcomeNotificationEmail({
      to: args.recipientEmail,
      recipientName: args.recipientName?.trim(),
      appName,
      appUrl,
      subject: `${businessName} is now live - ${appName}`,
      eyebrow: "Business launched",
      title: `${businessName} is now live`,
      lead: "Your business launch is complete. You can open the dashboard to review your workspace and begin managing operations.",
      ctaLabel: "Open dashboard",
      ctaUrl: dashboardUrl,
      steps: buildBusinessLaunchSteps(businessName),
    })
  }

  generateBusinessTeamMemberPassword() {
    return generateSecurePassword()
  }

  async sendBusinessTeamMemberWelcomeEmail(
    args: BusinessTeamMemberWelcomeEmailArgs
  ): Promise<void> {
    const appName = getAppName()
    const appUrl = getAppUrl()
    const businessName = args.businessName.trim()
    const dashboardUrl =
      args.dashboardUrl || `${appUrl.replace(/\/$/, "")}/dashboard`
    const roleLabel = args.role === "ADMIN" ? "Administrator" : "Manager"

    await emailService.sendWelcomeNotificationEmail({
      to: args.recipientEmail,
      recipientName: args.recipientName?.trim(),
      appName,
      appUrl,
      subject: `${businessName} dashboard access is ready - ${appName}`,
      eyebrow: `${roleLabel} access`,
      title: `Welcome to ${businessName}`,
      lead:
        args.role === "ADMIN"
          ? "Your administrator account is ready. Use the secure password below to open the dashboard and change it after your first login."
          : "Your manager access is ready. Use the secure password below to open the dashboard and change it after your first login.",
      ctaLabel: "Open dashboard",
      ctaUrl: dashboardUrl,
      password: args.password,
      securityNote:
        "For security, change this password after you sign in and keep it private.",
      steps: buildTeamMemberSteps(businessName, args.role),
    })
  }
}

export const notificationsService = new NotificationsService()
