import { NextResponse } from "next/server"

import { AnalyticsService } from "@/services/analytics/analytics.service"
import { withManager } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const analytics = await AnalyticsService.listAnalytics(businessId)
    return NextResponse.json({ ok: true, analytics })
  })
}
