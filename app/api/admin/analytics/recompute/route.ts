import { NextResponse } from "next/server"

import { isAnalyticsPeriod, type AnalyticsPeriod } from "@/lib/analytics"
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
        granularity?: AnalyticsPeriod | string
      }

      const granularity = isAnalyticsPeriod(body.granularity)
        ? body.granularity
        : undefined

      const computed = await AnalyticsService.recompute(businessId, {
        granularity,
        metricKeys: body.metrics,
      })

      return NextResponse.json({ ok: true, computed })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Analytics recompute failed"
      return apiErrorResponse(message, 500)
    }
  })
}
