import { CustomersCrudView } from "@/components/dashboard/crud/customers-crud-view"
import { requireDashboardSession } from "@/lib/dashboard/session"

export default async function CustomersPage() {
  await requireDashboardSession()

  return <CustomersCrudView />
}
