import { NextResponse } from "next/server"

import { FinancialReportService } from "@/services/report/financial-report.service"
import { withAdmin } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const summary = await FinancialReportService.getFinancialSummary(businessId)
    return NextResponse.json({ ok: true, summary })
  })
}
