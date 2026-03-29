import { NextResponse } from "next/server"

import { DashboardService } from "@/services/dashboard/dashboard.service"
import { withManager } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId, session }) => {
    const dashboard =
      session.user.role?.toUpperCase() === "ADMIN"
        ? await DashboardService.getDashboard(businessId)
        : await DashboardService.getManagerDashboard(businessId)

    return NextResponse.json({ ok: true, dashboard })
  })
}
