import { TransactionsCrudView } from "@/components/dashboard/crud/transactions-crud-view"
import { requireDashboardSession } from "@/lib/dashboard/session"

export default async function TransactionsPage() {
  await requireDashboardSession()

  return <TransactionsCrudView />
}
