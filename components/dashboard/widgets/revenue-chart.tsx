"use client"

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts"

import { formatCompactGhanaCedi, formatGhanaCedi } from "@/lib/dashboard/format"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  expense: {
    color: "hsl(var(--muted-foreground))",
    label: "Expenses",
  },
  revenue: {
    color: "hsl(var(--primary))",
    label: "Revenue",
  },
} as const

export function RevenueChart({
  series,
  subtitle,
  title,
}: {
  series: Array<{
    expense?: number
    label: string
    revenue: number
  }>
  subtitle?: string
  title: string
}) {
  const chartData = series.map((point) => ({
    expense: point.expense ?? 0,
    revenue: point.revenue,
    label: point.label,
  }))

  const totalRevenue = chartData.reduce(
    (total, point) => total + point.revenue,
    0
  )
  const totalExpenses = chartData.reduce(
    (total, point) => total + point.expense,
    0
  )
  const latestPoint = chartData.at(-1)
  const peakRevenue = chartData.reduce(
    (peak, point) => Math.max(peak, point.revenue),
    0
  )
  const maxValue = Math.max(
    1,
    ...chartData.flatMap((point) => [point.revenue, point.expense])
  )

  return (
    <section className="overflow-hidden border border-border bg-card text-card-foreground">
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Trend overview
          </p>
          <h2 className="mt-2 text-base font-semibold text-foreground">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-3 text-left sm:min-w-[24rem]">
          <SummaryChip
            label="Latest"
            value={
              latestPoint ? formatCompactGhanaCedi(latestPoint.revenue) : "-"
            }
          />
          <SummaryChip
            label="Peak"
            value={formatCompactGhanaCedi(peakRevenue)}
          />
          <SummaryChip
            label="Net"
            value={formatCompactGhanaCedi(totalRevenue - totalExpenses)}
          />
        </div>
      </div>

      {chartData.length ? (
        <div className="px-3 py-3 sm:px-4">
          <ChartContainer
            className="aspect-auto h-85 w-full"
            config={chartConfig}
          >
            <ComposedChart
              accessibilityLayer
              data={chartData}
              margin={{ bottom: 0, left: 8, right: 8, top: 16 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-expense)"
                    stopOpacity={0.55}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-expense)"
                    stopOpacity={0.12}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                axisLine={false}
                dataKey="label"
                tickLine={false}
                tickMargin={12}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                domain={[0, Math.ceil(maxValue * 1.15)]}
                tickFormatter={(value) => formatCompactGhanaCedi(Number(value))}
                tickLine={false}
                tickMargin={12}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                width={82}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <div className="flex w-full items-center justify-between gap-6">
                        <span className="text-muted-foreground">
                          {name === "revenue" ? "Revenue" : "Expenses"}
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {formatGhanaCedi(Number(value))}
                        </span>
                      </div>
                    )}
                    indicator="dashed"
                    labelFormatter={(value) => `${value}`}
                  />
                }
              />

              <Bar
                dataKey="expense"
                fill="url(#expenseFill)"
                name="Expenses"
                radius={[8, 8, 0, 0]}
                barSize={18}
              />
              <Area
                dataKey="revenue"
                fill="url(#revenueFill)"
                name="Revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2.5}
                type="monotone"
              />
              <Line
                dataKey="revenue"
                dot={{ r: 3, strokeWidth: 2, fill: "hsl(var(--card))" }}
                name="Revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                type="monotone"
              />
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign="bottom"
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      ) : (
        <div className="flex h-85 items-center justify-center px-4 text-sm text-muted-foreground">
          No trend data available.
        </div>
      )}
    </section>
  )
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background px-3 py-2">
      <p className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}
