import { NextResponse } from "next/server"

import {
  AnalyticsService,
  type AnalyticsMetricKey,
} from "@/services/analytics/analytics.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"

export async function POST(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const body = (await request.json().catch(() => ({}))) as {
        metrics?: AnalyticsMetricKey[]
      }

      const computed = await AnalyticsService.recompute(
        businessId,
        body.metrics
      )

      return NextResponse.json({ ok: true, computed })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Analytics recompute failed"
      return apiErrorResponse(message, 500)
    }
  })
}
