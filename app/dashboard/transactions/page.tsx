import { TransactionsTable } from "@/components/dashboard/tables/transactions-table"
import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireDashboardSession,
} from "@/lib/dashboard/session"
import { formatCompactGhanaCedi } from "@/lib/dashboard/format"

type TransactionsResponse = {
  transactions: Array<{
    customer?: { name?: string | null } | null
    id: string
    items: Array<{ id: string }>
    soldAt: string
    soldBy?: { name?: string | null } | null
    status: string
    totalAmount: number
    transactionNumber?: string | null
    reference?: string | null
  }>
}

export default async function TransactionsPage() {
  await requireDashboardSession()

  const { transactions } = await fetchDashboardApi<TransactionsResponse>(
    "/api/admin/transactions"
  )

  const totalRevenue = transactions.reduce(
    (total, transaction) => total + transaction.totalAmount,
    0
  )
  const completed = transactions.filter(
    (transaction) => transaction.status.toUpperCase() === "COMPLETED"
  )
  const pending = transactions.filter(
    (transaction) => transaction.status.toUpperCase() === "PENDING"
  )
  const totalItems = transactions.reduce(
    (total, transaction) => total + transaction.items.length,
    0
  )

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Sales operations
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Transactions.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            All sales records are loaded from the admin transactions endpoint
            and summarized for daily operational review.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="Gross value of all returned sales records"
          icon="payments"
          title="Revenue"
          value={formatCompactGhanaCedi(totalRevenue)}
        />
        <StatsCard
          caption="Transactions with completed status"
          icon="check_circle"
          title="Completed"
          value={String(completed.length)}
        />
        <StatsCard
          caption="Transactions still awaiting completion"
          changeTone="neutral"
          icon="hourglass_empty"
          title="Pending"
          value={String(pending.length)}
        />
        <StatsCard
          caption="Total line items sold across the current dataset"
          icon="inventory_2"
          title="Line items"
          value={String(totalItems)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <TransactionsTable rows={transactions} title="Sales transactions" />
        <ActivityFeed
          items={transactions.slice(0, 5).map((transaction) => ({
            description: `${transaction.customer?.name ?? "Walk-in customer"} · ${transaction.items.length} item(s)`,
            icon: "receipt_long",
            meta: transaction.soldBy?.name ?? "System",
            title:
              transaction.transactionNumber ??
              transaction.reference ??
              transaction.id,
            tone:
              transaction.status.toUpperCase() === "COMPLETED"
                ? "success"
                : transaction.status.toUpperCase() === "PENDING"
                  ? "warning"
                  : "danger",
          }))}
          title="Recent transactions"
        />
      </section>
    </div>
  )
}
