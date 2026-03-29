import { NextResponse } from "next/server"

import { SettingsService } from "@/services/settings/settings.service"
import { BusinessService } from "@/services/business/business.service"
import { getErrorMessage } from "@/services/shared/error.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"
import { normalizeOptionalNumber } from "@/services/shared/validation.service"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const [business, settings] = await Promise.all([
      BusinessService.getProfile(businessId),
      SettingsService.getSettings(businessId),
    ])

    if (!business) {
      return apiErrorResponse("Business not found", 404)
    }

    return NextResponse.json({ ok: true, business, settings })
  })
}

export async function PATCH(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>
      const result = await SettingsService.updateSettings(businessId, {
        adaptiveInsightsEnabled:
          typeof body.adaptiveInsightsEnabled === "boolean"
            ? body.adaptiveInsightsEnabled
            : undefined,
        analyticsWindowDays: normalizeOptionalNumber(body.analyticsWindowDays),
        autoReorderEnabled:
          typeof body.autoReorderEnabled === "boolean"
            ? body.autoReorderEnabled
            : undefined,
        dashboardDefaults: body.dashboardDefaults,
        lowStockThreshold: normalizeOptionalNumber(body.lowStockThreshold),
        notificationPreferences: body.notificationPreferences,
        overstockAlertThreshold: normalizeOptionalNumber(body.overstockAlertThreshold),
        reorderReviewIntervalDays: normalizeOptionalNumber(
          body.reorderReviewIntervalDays
        ),
        stockoutAlertThreshold: normalizeOptionalNumber(body.stockoutAlertThreshold),
      })

      return NextResponse.json({ ok: true, ...result })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
