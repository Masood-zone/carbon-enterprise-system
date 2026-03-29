import { NextResponse } from "next/server"

import { TransactionService } from "@/services/transaction/transaction.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withManager(request, async ({ businessId }) => {
    const { id } = await context.params
    const transaction = await TransactionService.getById(businessId, id)

    if (!transaction) {
      return apiErrorResponse("Transaction not found", 404)
    }

    return NextResponse.json({ ok: true, transaction })
  })
}
