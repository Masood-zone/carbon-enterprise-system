export function formatGhanaCedi(value: number) {
  return new Intl.NumberFormat("en-GH", {
    currency: "GHS",
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    style: "currency",
  })
    .format(value)
    .replace("GHS", "GH¢")
}

export function formatCompactGhanaCedi(value: number) {
  return new Intl.NumberFormat("en-GH", {
    currency: "GHS",
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
  })
    .format(value)
    .replace("GHS", "GH¢")
}

export function formatDashboardDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value

  return date.toLocaleDateString("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDashboardDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value

  return date.toLocaleString("en-GH", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDashboardPercent(value: number) {
  const prefix = value > 0 ? "+" : ""
  return `${prefix}${value.toFixed(1)}%`
}
