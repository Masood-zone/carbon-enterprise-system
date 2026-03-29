import { NextResponse } from "next/server"

import { InventoryService } from "@/services/product/inventory.service"
import { withManager } from "@/services/shared/admin-guards"

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
