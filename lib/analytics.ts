export type AnalyticsMetricKey =
  | "demand_forecast"
  | "inventory_turnover"
  | "profit"
  | "revenue"

export type AnalyticsPeriod =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY"

type AnalyticsMetricMeta = {
  description: string
  label: string
}

const analyticsMetricMetaMap: Record<AnalyticsMetricKey, AnalyticsMetricMeta> =
  {
    revenue: {
      label: "Sales revenue",
      description: "Total sales value captured during the selected period.",
    },
    profit: {
      label: "Net profit",
      description:
        "Profit remaining after direct costs and operating expenses are removed.",
    },
    inventory_turnover: {
      label: "Stock turnover",
      description: "How quickly stocked items are moving through the business.",
    },
    demand_forecast: {
      label: "Demand outlook",
      description:
        "The expected level of customer demand based on forecast data.",
    },
  }

const analyticsPeriodLabelMap: Record<AnalyticsPeriod, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
}

function humanizeValue(value: string): string {
  return value
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/^\w/, (character) => character.toUpperCase())
}

export function isAnalyticsPeriod(
  value: string | undefined
): value is AnalyticsPeriod {
  if (!value) return false

  return value.trim().toUpperCase() in analyticsPeriodLabelMap
}

export function getAnalyticsMetricMeta(metricKey: string): AnalyticsMetricMeta {
  const normalizedKey = metricKey.trim().toLowerCase() as AnalyticsMetricKey
  const meta = analyticsMetricMetaMap[normalizedKey]

  if (meta) {
    return meta
  }

  const label = humanizeValue(metricKey)
  return {
    description: `${label} summary for the selected period.`,
    label,
  }
}

export function getAnalyticsPeriodLabel(period: string): string {
  const normalizedPeriod = period.trim().toUpperCase() as AnalyticsPeriod
  return analyticsPeriodLabelMap[normalizedPeriod] || humanizeValue(period)
}

export function getAnalyticsPeriodRange(
  referenceDate: Date,
  period: AnalyticsPeriod
) {
  const start = new Date(referenceDate)
  const end = new Date(referenceDate)

  if (period === "DAILY") {
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    return { end, start }
  }

  if (period === "WEEKLY") {
    const dayIndex = start.getDay()
    start.setDate(start.getDate() - dayIndex)
    start.setHours(0, 0, 0, 0)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999)
    return { end, start }
  }

  if (period === "MONTHLY") {
    start.setDate(1)
    start.setHours(0, 0, 0, 0)
    end.setMonth(end.getMonth() + 1, 0)
    end.setHours(23, 59, 59, 999)
    return { end, start }
  }

  if (period === "QUARTERLY") {
    const quarterStartMonth = start.getMonth() - (start.getMonth() % 3)
    start.setMonth(quarterStartMonth, 1)
    start.setHours(0, 0, 0, 0)
    end.setMonth(quarterStartMonth + 3, 0)
    end.setHours(23, 59, 59, 999)
    return { end, start }
  }

  start.setMonth(0, 1)
  start.setHours(0, 0, 0, 0)
  end.setMonth(12, 0)
  end.setHours(23, 59, 59, 999)
  return { end, start }
}

export function formatAnalyticsPeriodRange(start: Date, end: Date): string {
  const formatter = new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  return `${formatter.format(start)} - ${formatter.format(end)}`
}

export function formatAnalyticsMetricValue(
  metricKey: string,
  value: number
): string {
  const normalizedKey = metricKey.trim().toLowerCase()
  const numberFormatter = new Intl.NumberFormat("en-GH", {
    maximumFractionDigits: normalizedKey === "inventory_turnover" ? 2 : 0,
  })
  const currencyFormatter = new Intl.NumberFormat("en-GH", {
    currency: "GHS",
    maximumFractionDigits: 0,
    style: "currency",
  })

  if (normalizedKey === "revenue" || normalizedKey === "profit") {
    return currencyFormatter.format(value)
  }

  if (normalizedKey === "inventory_turnover") {
    return numberFormatter.format(value)
  }

  return numberFormatter.format(value)
}
