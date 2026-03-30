import { NextResponse } from "next/server"

import { TransactionService } from "@/services/transaction/transaction.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeOptionalString } from "@/services/shared/validation.service"

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

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withManager(request, async ({ businessId, session }) => {
    try {
      const { id } = await context.params
      const body = (await request.json()) as Record<string, unknown>

      const transaction = await TransactionService.update(
        businessId,
        id,
        session.user.id,
        {
          paymentMethod: normalizeOptionalString(body.paymentMethod),
          reference: normalizeOptionalString(body.reference),
          status: normalizeOptionalString(body.status),
          transactionNumber: normalizeOptionalString(body.transactionNumber),
        }
      )

      if (!transaction) {
        return apiErrorResponse("Transaction not found", 404)
      }

      return NextResponse.json({ ok: true, transaction })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withManager(request, async ({ businessId, session }) => {
    try {
      const { id } = await context.params
      const transaction = await TransactionService.void(
        businessId,
        id,
        session.user.id
      )

      if (!transaction) {
        return apiErrorResponse("Transaction not found", 404)
      }

      return NextResponse.json({ ok: true, transaction })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
