import { NextResponse } from "next/server"

import { FinancialReportService } from "@/services/report/financial-report.service"
import { withManager } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const summary = await FinancialReportService.getFinancialSummary(businessId)
    return NextResponse.json({ ok: true, summary })
  })
}
