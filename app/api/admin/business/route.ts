import { NextResponse } from "next/server"

import { BusinessService } from "@/services/business/business.service"
import { getErrorMessage } from "@/services/shared/error.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"
import {
  normalizeNumber,
  normalizeOptionalString,
} from "@/services/shared/validation.service"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const business = await BusinessService.getProfile(businessId)

    if (!business) {
      return apiErrorResponse("Business not found", 404)
    }

    return NextResponse.json({ ok: true, business })
  })
}

export async function PATCH(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>
      const business = await BusinessService.updateProfile(businessId, {
        currency: normalizeOptionalString(body.currency),
        location: normalizeOptionalString(body.location),
        name: normalizeOptionalString(body.name),
        taxRate:
          body.taxRate === null
            ? null
            : body.taxRate !== undefined
              ? normalizeNumber(body.taxRate)
              : undefined,
        type: normalizeOptionalString(body.type),
      })

      return NextResponse.json({ ok: true, business })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
