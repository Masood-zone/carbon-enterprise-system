import { NextResponse } from "next/server"

import ExcelJS from "exceljs"

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
import { createPdfBuffer, drawPdfHeader, drawPdfTable } from "@/lib/exports/pdf"
import { getExportThemeTokens } from "@/lib/exports/theme"
import {
  formatCompactGhanaCedi,
  formatDashboardDate,
  formatGhanaCedi,
} from "@/lib/dashboard/format"
import { FinancialReportService } from "@/services/report/financial-report.service"
import { apiErrorResponse, withManager } from "@/services/shared/admin-guards"

export const runtime = "nodejs"

export async function GET(request: Request) {
  return withManager(request, async ({ businessId }) => {
    const { searchParams } = new URL(request.url)
    const format = parseExportFormat(searchParams.get("format"))

    if (!format) {
      return apiErrorResponse("Unsupported export format", 400)
    }

    const [theme, summary, profitLoss, cashFlow] = await Promise.all([
      getExportThemeTokens(),
      FinancialReportService.getFinancialSummary(businessId),
      FinancialReportService.getProfitLoss(businessId),
      FinancialReportService.getCashFlow(businessId),
    ])

    const generatedAt = new Date()
    const baseName = `reports-${generatedAt.toISOString().slice(0, 10)}`
    const filename = buildAttachmentFilename(baseName, format)

    const margin = summary.totalRevenue
      ? (summary.netProfit / summary.totalRevenue) * 100
      : 0

    if (format === "csv") {
      const rows = summary.trendSeries.map((entry) => ({
        day: entry.day,
        revenue: entry.revenue,
        expenses: entry.expenses,
        netProfit: entry.netProfit,
      }))

      const csv = toCsv(rows, ["day", "revenue", "expenses", "netProfit"])

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

      const summarySheet = workbook.addWorksheet("Summary")
      setSheetColumns(summarySheet, [
        { header: "Metric", key: "metric", width: 24 },
        { header: "Value", key: "value", width: 22 },
      ])

      summarySheet.addRows([
        {
          metric: "Total revenue",
          value: formatCompactGhanaCedi(summary.totalRevenue),
        },
        {
          metric: "Total expenses",
          value: formatCompactGhanaCedi(summary.totalExpenses),
        },
        {
          metric: "Net profit",
          value: formatCompactGhanaCedi(summary.netProfit),
        },
        { metric: "Operating margin", value: `${margin.toFixed(1)}%` },
      ])

      styleHeaderRow(summarySheet, theme)

      const trendSheet = workbook.addWorksheet("Trend")
      setSheetColumns(trendSheet, [
        { header: "Day", key: "day", width: 14 },
        { header: "Revenue", key: "revenue", width: 16 },
        { header: "Expenses", key: "expenses", width: 16 },
        { header: "Net profit", key: "netProfit", width: 16 },
      ])

      trendSheet.addRows(
        summary.trendSeries.map((entry) => ({
          day: entry.day,
          revenue: entry.revenue,
          expenses: entry.expenses,
          netProfit: entry.netProfit,
        }))
      )
      styleHeaderRow(trendSheet, theme)
      trendSheet.views = [{ state: "frozen", ySplit: 1 }]

      const profitLossSheet = workbook.addWorksheet("Profit & Loss")
      setSheetColumns(profitLossSheet, [
        { header: "Day", key: "day", width: 14 },
        { header: "Revenue", key: "revenue", width: 16 },
        { header: "Expenses", key: "expenses", width: 16 },
        { header: "Net profit", key: "netProfit", width: 16 },
      ])
      profitLossSheet.addRows(
        profitLoss.series.map((entry) => ({
          day: entry.day,
          revenue: entry.revenue,
          expenses: entry.expenses,
          netProfit: entry.netProfit,
        }))
      )
      styleHeaderRow(profitLossSheet, theme)
      profitLossSheet.views = [{ state: "frozen", ySplit: 1 }]

      const cashFlowSheet = workbook.addWorksheet("Cash Flow")
      setSheetColumns(cashFlowSheet, [
        { header: "Day", key: "day", width: 14 },
        { header: "Revenue", key: "revenue", width: 16 },
        { header: "Expenses", key: "expenses", width: 16 },
        { header: "Net profit", key: "netProfit", width: 16 },
      ])
      cashFlowSheet.addRows(
        cashFlow.series.map((entry) => ({
          day: entry.day,
          revenue: entry.revenue,
          expenses: entry.expenses,
          netProfit: entry.netProfit,
        }))
      )
      styleHeaderRow(cashFlowSheet, theme)
      cashFlowSheet.views = [{ state: "frozen", ySplit: 1 }]

      const salesSheet = workbook.addWorksheet("Sales")
      setSheetColumns(salesSheet, [
        { header: "Sold at", key: "soldAt", width: 22 },
        { header: "Total amount", key: "totalAmount", width: 18 },
      ])
      salesSheet.addRows(
        cashFlow.sales.map((sale) => ({
          soldAt: sale.soldAt,
          totalAmount: sale.totalAmount,
        }))
      )
      styleHeaderRow(salesSheet, theme)
      salesSheet.views = [{ state: "frozen", ySplit: 1 }]

      const expensesSheet = workbook.addWorksheet("Expenses")
      setSheetColumns(expensesSheet, [
        { header: "Occurred at", key: "occurredAt", width: 22 },
        { header: "Amount", key: "amount", width: 14 },
      ])
      expensesSheet.addRows(
        cashFlow.expenses.map((expense) => ({
          occurredAt: expense.occurredAt,
          amount: expense.amount,
        }))
      )
      styleHeaderRow(expensesSheet, theme)
      expensesSheet.views = [{ state: "frozen", ySplit: 1 }]

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

    const pdfBuffer = await createPdfBuffer((doc) => {
      drawPdfHeader(doc, theme, {
        title: "Reports Export",
        subtitle: "Financial summary, profit & loss, cash flow",
        generatedAt,
      })

      doc
        .fillColor(theme.foreground)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("Summary", { underline: false })

      doc
        .moveDown(0.6)
        .font("Helvetica")
        .fontSize(10)
        .fillColor(theme.mutedForeground)

      doc.text(`Total revenue: ${formatCompactGhanaCedi(summary.totalRevenue)}`)
      doc.text(
        `Total expenses: ${formatCompactGhanaCedi(summary.totalExpenses)}`
      )
      doc.text(`Net profit: ${formatCompactGhanaCedi(summary.netProfit)}`)
      doc.text(`Operating margin: ${margin.toFixed(1)}%`)
      doc.moveDown(1)

      const rows = summary.trendSeries.slice(-30).map((entry) => ({
        day: formatDashboardDate(entry.day),
        revenue: formatGhanaCedi(entry.revenue),
        expenses: formatGhanaCedi(entry.expenses),
        netProfit: formatGhanaCedi(entry.netProfit),
      }))

      drawPdfTable(doc, theme, {
        columns: [
          { key: "day", label: "Day", width: 120 },
          { key: "revenue", label: "Revenue", width: 120 },
          { key: "expenses", label: "Expenses", width: 120 },
          { key: "netProfit", label: "Net profit", width: 120 },
        ],
        rows,
      })

      if (summary.trendSeries.length > 30) {
        doc
          .moveDown(0.5)
          .fillColor(theme.mutedForeground)
          .fontSize(9)
          .text(
            `Showing last 30 days. Use CSV/XLSX exports for the full series.`
          )
      }
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "cache-control": "no-store",
        "content-disposition": buildContentDisposition(filename),
        "content-type": "application/pdf",
      },
    })
  })
}
