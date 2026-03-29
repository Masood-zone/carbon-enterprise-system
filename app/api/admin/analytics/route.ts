import { NextResponse } from "next/server"

import { AnalyticsService } from "@/services/analytics/analytics.service"
import { withAdmin } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const analytics = await AnalyticsService.listAnalytics(businessId)
    return NextResponse.json({ ok: true, analytics })
  })
}
