import { ExpensesCrudView } from "@/components/dashboard/crud/expenses-crud-view"
import { requireAdminDashboardSession } from "@/lib/dashboard/session"

export default async function ExpensesPage() {
  await requireAdminDashboardSession()

  return <ExpensesCrudView />
}
