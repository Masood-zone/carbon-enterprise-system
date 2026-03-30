import { NextResponse } from "next/server"

import { TransactionService } from "@/services/transaction/transaction.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import {
  normalizeNumber,
  normalizeOptionalString,
  normalizeString,
} from "@/services/shared/validation.service"

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

export async function POST(request: Request) {
  return withManager(request, async ({ businessId, session }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>
      const rawItems = Array.isArray(body.items) ? body.items : []

      const items = rawItems.map((item) => {
        const record = item as Record<string, unknown>

        return {
          productId: normalizeString(record.productId),
          quantity: normalizeNumber(record.quantity, Number.NaN),
          price:
            record.price === undefined
              ? undefined
              : normalizeNumber(record.price),
          discountAmount:
            record.discountAmount === undefined
              ? undefined
              : normalizeNumber(record.discountAmount),
        }
      })

      const transaction = await TransactionService.create(
        businessId,
        session.user.id,
        {
          customerId: normalizeOptionalString(body.customerId),
          items,
          paymentMethod: normalizeOptionalString(body.paymentMethod),
          reference: normalizeOptionalString(body.reference),
          soldAt: body.soldAt as string | Date | undefined,
          status: normalizeOptionalString(body.status),
          transactionNumber: normalizeOptionalString(body.transactionNumber),
        }
      )

      return NextResponse.json({ ok: true, transaction }, { status: 201 })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
