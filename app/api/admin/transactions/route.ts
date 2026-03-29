import { NextResponse } from "next/server"

import { TransactionService } from "@/services/transaction/transaction.service"
import { withManager } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const url = new URL(request.url)
    const transactions = await TransactionService.listByBusiness(businessId, {
      customerId: url.searchParams.get("customerId") || undefined,
      endDate: url.searchParams.get("endDate") || undefined,
      productId: url.searchParams.get("productId") || undefined,
      startDate: url.searchParams.get("startDate") || undefined,
    })

    return NextResponse.json({ ok: true, transactions })
  })
}
