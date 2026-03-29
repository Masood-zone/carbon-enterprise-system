import { NextResponse } from "next/server"

import { AnalyticsService } from "@/services/analytics/analytics.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"

export async function GET(
  request: Request,
  context: { params: Promise<{ metric: string }> }
) {
  return withManager(request, async ({ businessId }) => {
    const { metric } = await context.params
    const analytics = await AnalyticsService.getMetric(businessId, metric)

    if (!analytics.length) {
      return apiErrorResponse("Metric not found", 404)
    }

    return NextResponse.json({ ok: true, analytics })
  })
}
