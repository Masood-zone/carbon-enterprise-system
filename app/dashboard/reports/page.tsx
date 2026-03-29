import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { RevenueChart } from "@/components/dashboard/widgets/revenue-chart"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireAdminDashboardSession,
} from "@/lib/dashboard/session"
import {
  formatCompactGhanaCedi,
  formatDashboardDate,
  formatGhanaCedi,
} from "@/lib/dashboard/format"

type SummaryResponse = {
  summary: {
    netProfit: number
    totalExpenses: number
    totalRevenue: number
    trendSeries: Array<{
      day: string
      expenses: number
      netProfit: number
      revenue: number
    }>
  }
}

type ProfitLossResponse = {
  profitLoss: {
    expenses: Array<{ amount: number; occurredAt: string }>
    series: Array<{
      day: string
      expenses: number
      netProfit: number
      revenue: number
    }>
    transactions: Array<{ soldAt: string; totalAmount: number }>
  }
}

type CashFlowResponse = {
  cashFlow: {
    expenses: Array<{ amount: number; occurredAt: string }>
    sales: Array<{ soldAt: string; totalAmount: number }>
    series: Array<{
      day: string
      expenses: number
      netProfit: number
      revenue: number
    }>
  }
}

export default async function ReportsPage() {
  await requireAdminDashboardSession()

  const [{ summary }, { profitLoss }, { cashFlow }] = await Promise.all([
    fetchDashboardApi<SummaryResponse>("/api/admin/reports/financial-summary"),
    fetchDashboardApi<ProfitLossResponse>("/api/admin/reports/profit-loss"),
    fetchDashboardApi<CashFlowResponse>("/api/admin/reports/cash-flow"),
  ])

  const margin = summary.totalRevenue
    ? (summary.netProfit / summary.totalRevenue) * 100
    : 0

  return (
    <div className="space-y-6">
      <section className="border border-border bg-card p-6 text-card-foreground">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
          Financial reporting
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Reports.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Profit, loss, and cash flow data come from the reporting routes and
          are presented as a read-only finance overview.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="Total sales captured by the financial summary route"
          icon="payments"
          title="Total revenue"
          value={formatCompactGhanaCedi(summary.totalRevenue)}
        />
        <StatsCard
          caption="Total expenses captured in the same window"
          icon="request_quote"
          title="Total expenses"
          value={formatCompactGhanaCedi(summary.totalExpenses)}
        />
        <StatsCard
          caption="Revenue less expenses across the period"
          changeTone={summary.netProfit >= 0 ? "positive" : "negative"}
          icon="account_balance_wallet"
          title="Net profit"
          value={formatCompactGhanaCedi(summary.netProfit)}
        />
        <StatsCard
          caption="Net profit divided by revenue"
          icon="percent"
          title="Operating margin"
          value={`${margin.toFixed(1)}%`}
        />
      </section>

      <RevenueChart
        series={summary.trendSeries.slice(-8).map((point) => ({
          expense: point.expenses,
          label: new Date(point.day).toLocaleDateString("en-GH", {
            month: "short",
            day: "numeric",
          }),
          revenue: point.revenue,
        }))}
        subtitle="Revenue and expense trend from the financial summary route."
        title="Performance trend"
      />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-foreground">
              Profit and loss entries
            </h2>
            <p className="text-xs text-muted-foreground">
              {profitLoss.series.length} days
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Day</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Expenses</th>
                  <th className="px-4 py-3">Net profit</th>
                </tr>
              </thead>
              <tbody>
                {profitLoss.series.slice(-8).map((entry) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={entry.day}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDashboardDate(entry.day)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatGhanaCedi(entry.revenue)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatGhanaCedi(entry.expenses)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatGhanaCedi(entry.netProfit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ActivityFeed
          items={cashFlow.series.slice(-6).map((entry) => ({
            description: `Expenses ${formatGhanaCedi(entry.expenses)} · Revenue ${formatGhanaCedi(entry.revenue)}`,
            icon: "stacked_line_chart",
            meta: formatDashboardDate(entry.day),
            title: `Net ${formatGhanaCedi(entry.netProfit)}`,
            tone: entry.netProfit >= 0 ? "success" : "danger",
          }))}
          title="Cash flow summary"
        />
      </section>
    </div>
  )
}
