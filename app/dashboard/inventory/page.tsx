import { InventoryCrudView } from "@/components/dashboard/crud/inventory-crud-view"
import { requireDashboardSession } from "@/lib/dashboard/session"

export default async function InventoryPage() {
  await requireDashboardSession()

  return <InventoryCrudView />
}
