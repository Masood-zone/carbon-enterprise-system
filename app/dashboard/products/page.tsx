import { ProductsCrudView } from "@/components/dashboard/crud/products-crud-view"
import { requireDashboardSession } from "@/lib/dashboard/session"

export default async function ProductsPage() {
  await requireDashboardSession()

  return <ProductsCrudView />
}
