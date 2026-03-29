import { NextResponse } from "next/server"

import { TransactionItemService } from "@/services/transaction/transaction-item.service"
import { withManager } from "@/services/shared/admin-guards"

export async function GET(
  request: Request,
  context: { params: Promise<{ transactionId: string }> }
) {
  return withManager(request, async ({ businessId }) => {
    const { transactionId } = await context.params
    const items = await TransactionItemService.listByTransaction(
      businessId,
      transactionId
    )

    return NextResponse.json({ ok: true, items })
  })
}
