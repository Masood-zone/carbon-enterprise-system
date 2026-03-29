import { NextResponse } from "next/server"

import { ProductService } from "@/services/product/product.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import {
  normalizeNumber,
  normalizeOptionalNumber,
  normalizeOptionalString,
  normalizeString,
} from "@/services/shared/validation.service"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const products = await ProductService.listByBusiness(businessId)
    return NextResponse.json({ ok: true, products })
  })
}

export async function POST(request: Request) {
  return withManager(request, async ({ businessId }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>

      if (!normalizeString(body.name) || body.price === undefined) {
        return apiErrorResponse("Product name and price are required", 400)
      }

      const product = await ProductService.create(businessId, {
        barcode: normalizeOptionalString(body.barcode),
        category: normalizeOptionalString(body.category),
        costPrice:
          body.costPrice === null
            ? null
            : normalizeOptionalNumber(body.costPrice),
        description: normalizeOptionalString(body.description),
        isActive:
          typeof body.isActive === "boolean" ? body.isActive : undefined,
        leadTimeDays:
          body.leadTimeDays === null
            ? null
            : normalizeOptionalNumber(body.leadTimeDays),
        name: normalizeString(body.name),
        price: normalizeNumber(body.price),
        quantity: normalizeOptionalNumber(body.quantity),
        reorderPoint: normalizeOptionalNumber(body.reorderPoint),
        reorderQuantity:
          body.reorderQuantity === null
            ? null
            : normalizeOptionalNumber(body.reorderQuantity),
        safetyStock: normalizeOptionalNumber(body.safetyStock),
        sku: normalizeOptionalString(body.sku),
        stock: normalizeOptionalNumber(body.stock),
        unitOfMeasure: normalizeOptionalString(body.unitOfMeasure),
      })

      return NextResponse.json({ ok: true, product }, { status: 201 })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
