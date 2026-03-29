import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireAdminDashboardSession,
} from "@/lib/dashboard/session"
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"

type ExpensesResponse = {
  expenses: Array<{
    amount: number
    category: string
    createdAt: string
    id: string
    notes?: string | null
    occurredAt: string
    title: string
    vendorName?: string | null
  }>
}

export default async function ExpensesPage() {
  await requireAdminDashboardSession()

  const { expenses } = await fetchDashboardApi<ExpensesResponse>(
    "/api/admin/expenses"
  )

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )
  const averageExpense = expenses.length ? totalExpenses / expenses.length : 0
  const categoryCount = new Set(expenses.map((expense) => expense.category))
    .size

  return (
    <div className="space-y-6">
      <section className="border border-border bg-card p-6 text-card-foreground">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
          Financial oversight
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Expenses.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Expense records are visible only to administrators and are pulled from
          the admin expense route in read-only mode.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="All returned expense records"
          icon="request_quote"
          title="Total expenses"
          value={formatGhanaCedi(totalExpenses)}
        />
        <StatsCard
          caption="Average spend per expense record"
          icon="analytics"
          title="Average expense"
          value={formatGhanaCedi(averageExpense)}
        />
        <StatsCard
          caption="Expense categories represented in the dataset"
          icon="category"
          title="Categories"
          value={String(categoryCount)}
        />
        <StatsCard
          caption="Most recent expense date in the dataset"
          icon="schedule"
          title="Latest entry"
          value={
            expenses[0] ? formatDashboardDate(expenses[0].occurredAt) : "-"
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <div className="border border-border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-foreground">
              Expense ledger
            </h2>
            <p className="text-xs text-muted-foreground">
              {expenses.length} records
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={expense.id}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDashboardDate(expense.occurredAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {expense.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.category}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.vendorName ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatGhanaCedi(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.notes ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ActivityFeed
          items={expenses.slice(0, 5).map((expense) => ({
            description: `${expense.category} · ${expense.vendorName ?? "No vendor"}`,
            icon: "request_quote",
            meta: formatDashboardDate(expense.occurredAt),
            title: `${expense.title} · ${formatGhanaCedi(expense.amount)}`,
            tone: "danger" as const,
          }))}
          title="Recent expenses"
        />
      </section>
    </div>
  )
}
