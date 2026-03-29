import { NextResponse } from "next/server"

import { FinancialReportService } from "@/services/report/financial-report.service"
import { withAdmin } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const cashFlow = await FinancialReportService.getCashFlow(businessId)
    return NextResponse.json({ ok: true, cashFlow })
  })
}
