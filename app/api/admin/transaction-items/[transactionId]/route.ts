import { NextResponse } from "next/server"

import { TransactionItemService } from "@/services/transaction/transaction-item.service"
import { withAdmin } from "@/services/shared/admin-guards"

export async function GET(
  request: Request,
  context: { params: Promise<{ transactionId: string }> }
) {
  return withAdmin(request, async ({ businessId }) => {
    const { transactionId } = await context.params
    const items = await TransactionItemService.listByTransaction(
      businessId,
      transactionId
    )

    return NextResponse.json({ ok: true, items })
  })
}
