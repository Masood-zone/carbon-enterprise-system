import { NextResponse } from "next/server"

import { ProductService } from "@/services/product/product.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import {
  normalizeNumber,
  normalizeOptionalNumber,
  normalizeOptionalString,
} from "@/services/shared/validation.service"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async ({ businessId }) => {
    const { id } = await context.params
    const product = await ProductService.getById(businessId, id)

    if (!product) {
      return apiErrorResponse("Product not found", 404)
    }

    return NextResponse.json({ ok: true, product })
  })
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const { id } = await context.params
      const body = (await request.json()) as Record<string, unknown>

      const result = await ProductService.update(businessId, id, {
        barcode: normalizeOptionalString(body.barcode),
        category: normalizeOptionalString(body.category),
        costPrice: body.costPrice === null ? null : normalizeOptionalNumber(body.costPrice),
        description: normalizeOptionalString(body.description),
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : undefined,
        leadTimeDays: body.leadTimeDays === null ? null : normalizeOptionalNumber(body.leadTimeDays),
        name: normalizeOptionalString(body.name),
        price: body.price !== undefined ? normalizeNumber(body.price) : undefined,
        reorderPoint: normalizeOptionalNumber(body.reorderPoint),
        reorderQuantity: body.reorderQuantity === null ? null : normalizeOptionalNumber(body.reorderQuantity),
        safetyStock: normalizeOptionalNumber(body.safetyStock),
        sku: normalizeOptionalString(body.sku),
        stock: normalizeOptionalNumber(body.stock),
        unitOfMeasure: normalizeOptionalString(body.unitOfMeasure),
      })

      if (!result.count) {
        return apiErrorResponse("Product not found", 404)
      }

      const product = await ProductService.getById(businessId, id)

      return NextResponse.json({ ok: true, product })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const { id } = await context.params
      const result = await ProductService.delete(businessId, id)

      if (!result.count) {
        return apiErrorResponse("Product not found", 404)
      }

      return NextResponse.json({ ok: true, deleted: true })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
