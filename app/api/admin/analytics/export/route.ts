import { NextResponse } from "next/server"

import ExcelJS from "exceljs"

import {
  formatAnalyticsMetricValue,
  formatAnalyticsPeriodRange,
  getAnalyticsMetricMeta,
  getAnalyticsPeriodLabel,
} from "@/lib/analytics"
import {
  buildAttachmentFilename,
  buildContentDisposition,
  parseExportFormat,
} from "@/lib/exports/export-format"
import { toCsv } from "@/lib/exports/csv"
import {
  setSheetColumns,
  styleHeaderRow,
  workbookToBuffer,
} from "@/lib/exports/excel"
import { getExportThemeTokens } from "@/lib/exports/theme"
import { formatDashboardDateTime } from "@/lib/dashboard/format"
import { AnalyticsService } from "@/services/analytics/analytics.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"

export const runtime = "nodejs"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const { searchParams } = new URL(request.url)
    const format = parseExportFormat(searchParams.get("format"))

    if (!format) {
      return apiErrorResponse("Unsupported export format", 400)
    }

    const [theme, analytics] = await Promise.all([
      getExportThemeTokens(),
      AnalyticsService.listAnalytics(businessId),
    ])

    const generatedAt = new Date()
    const baseName = `analytics-${generatedAt.toISOString().slice(0, 10)}`
    const filename = buildAttachmentFilename(baseName, format)

    if (format === "csv") {
      const rows = analytics.map((entry) => ({
        metric: getAnalyticsMetricMeta(entry.metricKey).label,
        value: entry.value,
        valueFormatted: formatAnalyticsMetricValue(
          entry.metricKey,
          entry.value
        ),
        granularity: getAnalyticsPeriodLabel(entry.granularity),
        period: formatAnalyticsPeriodRange(entry.periodStart, entry.periodEnd),
        source: entry.source ?? "system",
        calculatedAt: entry.calculatedAt,
      }))

      const headers = [
        "metric",
        "value",
        "valueFormatted",
        "granularity",
        "period",
        "source",
        "calculatedAt",
      ]

      const csv = toCsv(rows, headers)

      return new NextResponse(csv, {
        headers: {
          "cache-control": "no-store",
          "content-disposition": buildContentDisposition(filename),
          "content-type": "text/csv; charset=utf-8",
        },
      })
    }

    if (format === "xlsx") {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = "Carbon Enterprise System"
      workbook.created = generatedAt

      const sheet = workbook.addWorksheet("Analytics")

      setSheetColumns(sheet, [
        { header: "Metric", key: "metric", width: 26 },
        { header: "Value", key: "valueFormatted", width: 18 },
        { header: "Granularity", key: "granularity", width: 14 },
        { header: "Period", key: "period", width: 28 },
        { header: "Source", key: "source", width: 16 },
        { header: "Calculated", key: "calculatedAt", width: 20 },
      ])

      sheet.addRows(
        analytics.map((entry) => ({
          metric: getAnalyticsMetricMeta(entry.metricKey).label,
          valueFormatted: formatAnalyticsMetricValue(
            entry.metricKey,
            entry.value
          ),
          granularity: getAnalyticsPeriodLabel(entry.granularity),
          period: formatAnalyticsPeriodRange(
            entry.periodStart,
            entry.periodEnd
          ),
          source: entry.source ?? "system",
          calculatedAt: formatDashboardDateTime(entry.calculatedAt),
        }))
      )

      styleHeaderRow(sheet, theme)
      sheet.views = [{ state: "frozen", ySplit: 1 }]

      const buffer = await workbookToBuffer(workbook)

      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "cache-control": "no-store",
          "content-disposition": buildContentDisposition(filename),
          "content-type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      })
    }

    return apiErrorResponse("Unsupported export format", 400)
  })
}
