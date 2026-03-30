import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { ExportDataDialog } from "@/components/dashboard/widgets/export-data-dialog"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  formatAnalyticsMetricValue,
  getAnalyticsMetricMeta,
  getAnalyticsPeriodLabel,
} from "@/lib/analytics"
import {
  fetchDashboardApi,
  requireAdminDashboardSession,
} from "@/lib/dashboard/session"
import {
  formatDashboardDateTime,
  formatGhanaCedi,
} from "@/lib/dashboard/format"

type AnalyticsResponse = {
  analytics: Array<{
    businessId: string
    calculatedAt: string
    granularity: string
    id: string
    metricKey: string
    periodEnd: string
    periodStart: string
    value: number
    source?: string | null
  }>
}

export default async function AnalyticsPage() {
  await requireAdminDashboardSession()

  const { analytics } = await fetchDashboardApi<AnalyticsResponse>(
    "/api/admin/analytics"
  )

  const latestByMetric = new Map<string, (typeof analytics)[number]>()
  for (const entry of analytics) {
    if (!latestByMetric.has(entry.metricKey)) {
      latestByMetric.set(entry.metricKey, entry)
    }
  }

  const latestRevenue = latestByMetric.get("revenue")
  const latestProfit = latestByMetric.get("profit")
  const latestTurnover = latestByMetric.get("inventory_turnover")
  const latestForecast = latestByMetric.get("demand_forecast")
  const latestMetrics = analytics.slice(0, 5)

  return (
    <div className="space-y-6">
      <section className="border border-border bg-card p-6 text-card-foreground">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
              Analytics
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Analytics overview.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Business-friendly summaries of sales, profit, stock movement, and
              demand are loaded from the admin analytics route so administrators
              can review the latest computed periods at a glance.
            </p>
          </div>

          <ExportDataDialog
            datasetLabel="Analytics"
            description="Select your preferred format for the Analytics dataset."
            exportPath="/api/admin/analytics/export"
            triggerLabel="Export data"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption={
            latestRevenue
              ? `${getAnalyticsPeriodLabel(latestRevenue.granularity)} · ${formatDashboardDateTime(latestRevenue.calculatedAt)}`
              : "No sales revenue metric"
          }
          icon="payments"
          title={getAnalyticsMetricMeta("revenue").label}
          value={latestRevenue ? formatGhanaCedi(latestRevenue.value) : "-"}
        />
        <StatsCard
          caption={
            latestProfit
              ? `${getAnalyticsPeriodLabel(latestProfit.granularity)} · ${formatDashboardDateTime(latestProfit.calculatedAt)}`
              : "No net profit metric"
          }
          icon="trending_up"
          title={getAnalyticsMetricMeta("profit").label}
          value={latestProfit ? formatGhanaCedi(latestProfit.value) : "-"}
        />
        <StatsCard
          caption={
            latestTurnover
              ? `${getAnalyticsPeriodLabel(latestTurnover.granularity)} · ${formatDashboardDateTime(latestTurnover.calculatedAt)}`
              : "No stock turnover metric"
          }
          icon="query_stats"
          title={getAnalyticsMetricMeta("inventory_turnover").label}
          value={
            latestTurnover
              ? formatAnalyticsMetricValue(
                  "inventory_turnover",
                  latestTurnover.value
                )
              : "-"
          }
        />
        <StatsCard
          caption={
            latestForecast
              ? `${getAnalyticsPeriodLabel(latestForecast.granularity)} · ${formatDashboardDateTime(latestForecast.calculatedAt)}`
              : "No demand outlook metric"
          }
          icon="forecast"
          title={getAnalyticsMetricMeta("demand_forecast").label}
          value={
            latestForecast
              ? formatAnalyticsMetricValue(
                  "demand_forecast",
                  latestForecast.value
                )
              : "-"
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <div className="border border-border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-foreground">
              Analytics cache
            </h2>
            <p className="text-xs text-muted-foreground">
              {analytics.length} records
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-230 text-left text-sm">
              <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Metric</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Granularity</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Calculated</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((entry) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={entry.id}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {getAnalyticsMetricMeta(entry.metricKey).label}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatAnalyticsMetricValue(entry.metricKey, entry.value)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {getAnalyticsPeriodLabel(entry.granularity)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDashboardDateTime(entry.periodStart)} -{" "}
                      {formatDashboardDateTime(entry.periodEnd)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.source ?? "system"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDashboardDateTime(entry.calculatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ActivityFeed
          items={latestMetrics.map((entry) => ({
            description: `${getAnalyticsPeriodLabel(entry.granularity)} · source ${entry.source ?? "system"}`,
            icon: "insights",
            meta: formatDashboardDateTime(entry.calculatedAt),
            title: `${getAnalyticsMetricMeta(entry.metricKey).label} = ${formatAnalyticsMetricValue(entry.metricKey, entry.value)}`,
            tone: "default",
          }))}
          title="Latest analytics"
        />
      </section>
    </div>
  )
}
