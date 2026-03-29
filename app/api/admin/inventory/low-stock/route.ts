import { NextResponse } from "next/server"

import { BusinessService } from "@/services/business/business.service"
import { InventoryService } from "@/services/product/inventory.service"
import { withManager } from "@/services/shared/admin-guards"
import { normalizeOptionalNumber } from "@/services/shared/validation.service"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const url = new URL(request.url)
    const settings = await BusinessService.getSettings(businessId)
    const threshold =
      normalizeOptionalNumber(url.searchParams.get("threshold")) ??
      settings?.lowStockThreshold ??
      10

    const lowStock = await InventoryService.listLowStock(businessId, threshold)

    return NextResponse.json({ ok: true, threshold, lowStock })
  })
}
