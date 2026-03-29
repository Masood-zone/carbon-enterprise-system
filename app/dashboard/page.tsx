import Link from "next/link"

import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { RevenueChart } from "@/components/dashboard/widgets/revenue-chart"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireDashboardSession,
} from "@/lib/dashboard/session"
import {
  formatCompactGhanaCedi,
  formatDashboardDate,
  formatDashboardPercent,
  formatGhanaCedi,
} from "@/lib/dashboard/format"

type DashboardResponse = {
  dashboard: {
    expenses: number
    lowStock: Array<{
      id: string
      name: string
      reorderPoint: number
      sku?: string | null
      stock: number
    }>
    profit: number
    recentTransactions: Array<{
      customer?: { name?: string | null } | null
      id: string
      soldAt: string
      status: string
      totalAmount: number
      transactionNumber?: string | null
      reference?: string | null
    }>
    revenue: number
    topProducts?: Array<{
      id: string
      name: string
      price: number
      soldQuantity: number
    }>
  }
}

type FinancialSummaryResponse = {
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

export default async function DashboardPage() {
  await requireDashboardSession()

  const [{ dashboard }, { summary }] = await Promise.all([
    fetchDashboardApi<DashboardResponse>("/api/admin/dashboard"),
    fetchDashboardApi<FinancialSummaryResponse>(
      "/api/admin/reports/financial-summary"
    ),
  ])

  const transactionCount = dashboard.recentTransactions.length
  const lowStockCount = dashboard.lowStock.length
  const topProducts = dashboard.topProducts ?? []
  const trend = summary.trendSeries.slice(-6)
  const feedItems = [
    ...dashboard.recentTransactions.slice(0, 3).map((transaction) => ({
      description: `${transaction.customer?.name ?? "Walk-in customer"} · ${formatGhanaCedi(transaction.totalAmount)}`,
      icon: "receipt_long",
      meta: formatDashboardDate(transaction.soldAt),
      title:
        transaction.transactionNumber ??
        transaction.reference ??
        transaction.id,
    })),
    ...dashboard.lowStock.slice(0, 2).map((product) => ({
      description: `Current stock ${product.stock} against reorder point ${product.reorderPoint}`,
      icon: "inventory_2",
      meta: product.sku ?? product.id,
      title: `Low stock: ${product.name}`,
      tone: "warning" as const,
    })),
    ...topProducts.slice(0, 2).map((product) => ({
      description: `${product.soldQuantity} units sold in the current period`,
      icon: "sell",
      meta: formatCompactGhanaCedi(product.price),
      title: product.name,
      tone: "success" as const,
    })),
  ].slice(0, 6)

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Dashboard overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Real-time business performance across the workspace.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Sales, profitability, and stock alerts are surfaced from the admin
            dashboard service so managers and administrators see the same live
            business picture.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link className="carbon-button-secondary" href="/dashboard/reports">
            View reports
          </Link>
          <Link className="carbon-button-primary" href="/dashboard/products">
            Open products
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="Revenue from the admin dashboard service"
          change={formatDashboardPercent(
            summary.totalRevenue > 0
              ? (summary.netProfit / summary.totalRevenue) * 100
              : 0
          )}
          changeTone="positive"
          icon="payments"
          title="Revenue"
          value={formatCompactGhanaCedi(dashboard.revenue)}
        />
        <StatsCard
          caption="Expenses captured in the current business window"
          changeTone="negative"
          icon="request_quote"
          title="Expenses"
          value={formatCompactGhanaCedi(dashboard.expenses)}
        />
        <StatsCard
          caption="Revenue less expenses from live accounting data"
          changeTone={dashboard.profit >= 0 ? "positive" : "negative"}
          icon="account_balance_wallet"
          title="Net profit"
          value={formatCompactGhanaCedi(dashboard.profit)}
        />
        <StatsCard
          caption="Items below reorder point or close to restock"
          change={
            transactionCount > 0
              ? `${transactionCount} recent sales`
              : "No recent sales"
          }
          changeTone="neutral"
          icon="warning"
          title="Low stock alerts"
          value={String(lowStockCount)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
        <RevenueChart
          series={trend.map((point) => ({
            expense: point.expenses,
            label: new Date(point.day).toLocaleDateString("en-GH", {
              month: "short",
              day: "numeric",
            }),
            revenue: point.revenue,
          }))}
          subtitle="Revenue and expense trend from the financial summary API."
          title="Financial trend"
        />
        <ActivityFeed items={feedItems} title="Recent activity" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="border border-border bg-card p-4 text-card-foreground">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Top products
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Highest demand items from the current business window.
              </p>
            </div>
            <Link
              className="text-xs font-medium text-primary hover:underline"
              href="/dashboard/inventory"
            >
              Review stock
            </Link>
          </div>

          {topProducts.length ? (
            <div className="mt-4 space-y-3">
              {topProducts.map((product) => (
                <div
                  className="flex items-center justify-between gap-4 border border-border bg-background px-3 py-3"
                  key={product.id}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.soldQuantity} sold · unit price{" "}
                      {formatGhanaCedi(product.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {formatGhanaCedi(product.soldQuantity * product.price)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 border border-dashed border-border bg-background px-3 py-4 text-sm text-muted-foreground">
              Top products are not available for this role.
            </p>
          )}
        </div>

        <div className="border border-border bg-card p-4 text-card-foreground">
          <h2 className="text-base font-semibold text-foreground">
            Low stock watchlist
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Products that need immediate replenishment or review.
          </p>

          <div className="mt-4 space-y-3">
            {dashboard.lowStock.map((product) => (
              <div
                className="flex items-center justify-between gap-4 border border-border bg-background px-3 py-3"
                key={product.id}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    SKU {product.sku ?? "-"} · reorder point{" "}
                    {product.reorderPoint}
                  </p>
                </div>
                <span className="inline-flex items-center border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-medium tracking-[0.18em] text-amber-700 uppercase">
                  Stock {product.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
