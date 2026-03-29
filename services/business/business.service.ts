import { prisma } from "@/lib/prisma"
import {
  normalizeNumber,
  normalizeString,
} from "@/services/shared/validation.service"

export type BusinessSettingsInput = {
  adaptiveInsightsEnabled?: boolean
  analyticsWindowDays?: number
  autoReorderEnabled?: boolean
  dashboardDefaults?: unknown
  lowStockThreshold?: number
  notificationPreferences?: unknown
  overstockAlertThreshold?: number
  reorderReviewIntervalDays?: number
  stockoutAlertThreshold?: number
}

export type BusinessProfileUpdateInput = {
  currency?: string
  location?: string
  name?: string
  taxRate?: number | null
  type?: string
}

export class BusinessService {
  static async getProfile(businessId: string) {
    return prisma.business.findUnique({
      where: { id: businessId },
      include: {
        settings: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            lastActiveAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
  }

  static async updateProfile(
    businessId: string,
    input: BusinessProfileUpdateInput
  ) {
    const data = {
      ...(input.currency !== undefined
        ? { currency: normalizeString(input.currency, "GHS") || "GHS" }
        : {}),
      ...(input.location !== undefined
        ? { location: normalizeString(input.location) }
        : {}),
      ...(input.name !== undefined
        ? { name: normalizeString(input.name) }
        : {}),
      ...(input.taxRate === null
        ? { taxRate: null }
        : input.taxRate !== undefined
          ? { taxRate: normalizeNumber(input.taxRate) }
          : {}),
      ...(input.type !== undefined
        ? { type: normalizeString(input.type) }
        : {}),
    }

    return prisma.business.update({
      where: { id: businessId },
      data,
      include: {
        settings: true,
      },
    })
  }

  static async getSettings(businessId: string) {
    return prisma.businessSettings.findUnique({
      where: { businessId },
    })
  }

  static async updateSettings(
    businessId: string,
    input: BusinessSettingsInput
  ) {
    return prisma.$transaction(async (transaction) => {
      const business = await transaction.business.findUnique({
        where: { id: businessId },
      })

      if (!business) {
        throw new Error("Business not found")
      }

      const settings = await transaction.businessSettings.upsert({
        where: { businessId },
        create: {
          businessId,
          adaptiveInsightsEnabled: input.adaptiveInsightsEnabled ?? true,
          analyticsWindowDays: input.analyticsWindowDays ?? 90,
          autoReorderEnabled: input.autoReorderEnabled ?? false,
          dashboardDefaults: input.dashboardDefaults ?? {},
          lowStockThreshold: input.lowStockThreshold ?? 10,
          overstockAlertThreshold: input.overstockAlertThreshold ?? 90,
          reorderReviewIntervalDays: input.reorderReviewIntervalDays ?? 7,
          stockoutAlertThreshold: input.stockoutAlertThreshold ?? 3,
          analyticsConfig:
            input.notificationPreferences === undefined
              ? {}
              : { notificationPreferences: input.notificationPreferences },
        },
        update: {
          ...(input.adaptiveInsightsEnabled !== undefined
            ? { adaptiveInsightsEnabled: input.adaptiveInsightsEnabled }
            : {}),
          ...(input.analyticsWindowDays !== undefined
            ? { analyticsWindowDays: normalizeNumber(input.analyticsWindowDays, 90) }
            : {}),
          ...(input.autoReorderEnabled !== undefined
            ? { autoReorderEnabled: input.autoReorderEnabled }
            : {}),
          ...(input.dashboardDefaults !== undefined
            ? { dashboardDefaults: input.dashboardDefaults }
            : {}),
          ...(input.lowStockThreshold !== undefined
            ? { lowStockThreshold: normalizeNumber(input.lowStockThreshold, 10) }
            : {}),
          ...(input.overstockAlertThreshold !== undefined
            ? { overstockAlertThreshold: normalizeNumber(input.overstockAlertThreshold, 90) }
            : {}),
          ...(input.reorderReviewIntervalDays !== undefined
            ? {
                reorderReviewIntervalDays: normalizeNumber(
                  input.reorderReviewIntervalDays,
                  7
                ),
              }
            : {}),
          ...(input.stockoutAlertThreshold !== undefined
            ? { stockoutAlertThreshold: normalizeNumber(input.stockoutAlertThreshold, 3) }
            : {}),
          ...(input.notificationPreferences !== undefined
            ? { analyticsConfig: { notificationPreferences: input.notificationPreferences } }
            : {}),
        },
      })

      return {
        business,
        settings,
      }
    })
  }
}
