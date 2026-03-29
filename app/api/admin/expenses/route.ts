import { NextResponse } from "next/server"

import { ExpenseService } from "@/services/expense/expense.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import {
  normalizeNumber,
  normalizeOptionalString,
  normalizeString,
} from "@/services/shared/validation.service"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const url = new URL(request.url)
    const expenses = await ExpenseService.listByBusiness(businessId, {
      endDate: url.searchParams.get("endDate") || undefined,
      startDate: url.searchParams.get("startDate") || undefined,
    })

    return NextResponse.json({ ok: true, expenses })
  })
}

export async function POST(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>

      if (
        !normalizeString(body.title) ||
        !normalizeString(body.category) ||
        body.amount === undefined
      ) {
        return apiErrorResponse("Title, category, and amount are required", 400)
      }

      const expense = await ExpenseService.create(businessId, {
        amount: normalizeNumber(body.amount),
        category: normalizeString(body.category),
        notes: normalizeOptionalString(body.notes),
        title: normalizeString(body.title),
        vendorName: normalizeOptionalString(body.vendorName),
        occurredAt: body.occurredAt as string | Date | undefined,
      })

      return NextResponse.json({ ok: true, expense }, { status: 201 })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
