import { NextResponse } from "next/server"

import { InventoryService } from "@/services/product/inventory.service"
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
    const productId = url.searchParams.get("productId") || undefined
    const movements = await InventoryService.listMovements(
      businessId,
      productId
    )

    return NextResponse.json({ ok: true, movements })
  })
}

const supportedMovementTypes = new Set([
  "ADJUSTMENT",
  "COUNT",
  "PURCHASE",
  "RETURN",
  "TRANSFER",
  "WRITE_OFF",
])

export async function POST(request: Request) {
  return withManager(request, async ({ businessId, session }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>

      const productId = normalizeString(body.productId)
      const movementType = normalizeString(body.movementType).toUpperCase()
      const quantity = Math.trunc(normalizeNumber(body.quantity, Number.NaN))

      if (!productId || !supportedMovementTypes.has(movementType)) {
        return apiErrorResponse(
          "Valid productId and movementType are required",
          400
        )
      }

      if (!Number.isFinite(quantity) || quantity === 0) {
        return apiErrorResponse("Quantity must be a non-zero number", 400)
      }

      const movement = await InventoryService.recordMovement(
        businessId,
        session.user.id,
        {
          movementType,
          notes: normalizeOptionalString(body.notes),
          productId,
          quantity,
        }
      )

      return NextResponse.json({ ok: true, movement }, { status: 201 })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
