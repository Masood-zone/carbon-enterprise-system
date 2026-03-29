import { NextResponse } from "next/server"

import { ExpenseService } from "@/services/expense/expense.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import {
  normalizeOptionalNumber,
  normalizeOptionalString,
} from "@/services/shared/validation.service"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withManager(request, async ({ businessId }) => {
    try {
      const { id } = await context.params
      const body = (await request.json()) as Record<string, unknown>

      const result = await ExpenseService.update(businessId, id, {
        amount: normalizeOptionalNumber(body.amount),
        category: normalizeOptionalString(body.category),
        notes: normalizeOptionalString(body.notes),
        occurredAt: body.occurredAt as string | Date | undefined,
        title: normalizeOptionalString(body.title),
        vendorName: normalizeOptionalString(body.vendorName),
      })

      if (!result.count) {
        return apiErrorResponse("Expense not found", 404)
      }

      const expense = await ExpenseService.getById(businessId, id)
      return NextResponse.json({ ok: true, expense })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withManager(request, async ({ businessId }) => {
    try {
      const { id } = await context.params
      const result = await ExpenseService.delete(businessId, id)

      if (!result.count) {
        return apiErrorResponse("Expense not found", 404)
      }

      return NextResponse.json({ ok: true, deleted: true })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
