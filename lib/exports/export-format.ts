export type ExportFormat = "pdf" | "xlsx" | "csv"

export function parseExportFormat(value: string | null): ExportFormat | null {
  if (!value) return null
  const normalized = value.toLowerCase()
  if (normalized === "pdf") return "pdf"
  if (normalized === "xlsx") return "xlsx"
  if (normalized === "csv") return "csv"
  return null
}

export function sanitizeFilenamePart(value: string) {
  return value
    .trim()
    .replaceAll(/\s+/g, "-")
    .replaceAll(/[^a-zA-Z0-9._-]/g, "")
    .replaceAll(/-+/g, "-")
}

export function buildAttachmentFilename(base: string, format: ExportFormat) {
  const safeBase = sanitizeFilenamePart(base || "export") || "export"
  return `${safeBase}.${format}`
}

export function buildContentDisposition(filename: string) {
  const fallback = filename.replaceAll(/["]+/g, "")
  return `attachment; filename="${fallback}"`
}
