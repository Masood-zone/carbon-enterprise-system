import { NextResponse } from "next/server"

import { DashboardService } from "@/services/dashboard/dashboard.service"
import { withAdmin } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const dashboard = await DashboardService.getDashboard(businessId)
    return NextResponse.json({ ok: true, dashboard })
  })
}
