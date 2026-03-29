import { NextResponse } from "next/server"

import { CustomerService } from "@/services/customer/customer.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeOptionalString, normalizeString } from "@/services/shared/validation.service"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const customers = await CustomerService.listByBusiness(businessId)
    return NextResponse.json({ ok: true, customers })
  })
}

export async function POST(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>

      if (!normalizeString(body.name)) {
        return apiErrorResponse("Customer name is required", 400)
      }

      const customer = await CustomerService.create(businessId, {
        email: normalizeOptionalString(body.email),
        name: normalizeString(body.name),
        notes: normalizeOptionalString(body.notes),
        phone: normalizeOptionalString(body.phone),
        segment: normalizeOptionalString(body.segment),
      })

      return NextResponse.json({ ok: true, customer }, { status: 201 })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
