export function toCsv(rows: Array<Record<string, unknown>>, headers: string[]) {
  const lines: string[] = []
  lines.push(headers.map(escapeCsvValue).join(","))

  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsvValue(row[header])).join(","))
  }

  // Excel-friendly UTF-8 BOM
  return `\uFEFF${lines.join("\n")}`
}

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) return ""
  const text =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "string"
        ? value
        : typeof value === "number" || typeof value === "bigint"
          ? String(value)
          : typeof value === "boolean"
            ? value
              ? "true"
              : "false"
            : JSON.stringify(value)

  if (/[\r\n,"]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`
  }

  return text
}
