import { NextResponse } from "next/server"

import { CustomerService } from "@/services/customer/customer.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeOptionalString } from "@/services/shared/validation.service"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withManager(request, async ({ businessId }) => {
    const { id } = await context.params
    const customer = await CustomerService.getById(businessId, id)

    if (!customer) {
      return apiErrorResponse("Customer not found", 404)
    }

    return NextResponse.json({ ok: true, customer })
  })
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withManager(request, async ({ businessId }) => {
    try {
      const { id } = await context.params
      const body = (await request.json()) as Record<string, unknown>

      const result = await CustomerService.update(businessId, id, {
        email: normalizeOptionalString(body.email),
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : undefined,
        name: normalizeOptionalString(body.name),
        notes: normalizeOptionalString(body.notes),
        phone: normalizeOptionalString(body.phone),
        segment: normalizeOptionalString(body.segment),
      })

      if (!result.count) {
        return apiErrorResponse("Customer not found", 404)
      }

      const customer = await CustomerService.getById(businessId, id)
      return NextResponse.json({ ok: true, customer })
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
      const result = await CustomerService.delete(businessId, id)

      if (!result.count) {
        return apiErrorResponse("Customer not found", 404)
      }

      return NextResponse.json({ ok: true, deleted: true })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
