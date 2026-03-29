import { NextResponse } from "next/server"

import { InventoryService } from "@/services/product/inventory.service"
import { withManager } from "@/services/shared/admin-guards"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const inventory = await InventoryService.listInventory(businessId)
    return NextResponse.json({ ok: true, inventory })
  })
}
