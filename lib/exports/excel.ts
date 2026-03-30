import ExcelJS from "exceljs"

import { hexToExcelArgb, type ExportThemeTokens } from "./theme"

export type ExcelColumn = {
  header: string
  key: string
  width?: number
}

export async function workbookToBuffer(workbook: ExcelJS.Workbook) {
  const arrayBuffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(arrayBuffer)
}

export function styleHeaderRow(
  sheet: ExcelJS.Worksheet,
  theme: ExportThemeTokens
) {
  const headerRow = sheet.getRow(1)
  headerRow.font = {
    bold: true,
    color: { argb: hexToExcelArgb(theme.primaryForeground) },
  }

  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: hexToExcelArgb(theme.primary) },
  }

  headerRow.alignment = { vertical: "middle" }
  headerRow.height = 18

  headerRow.eachCell((cell) => {
    cell.border = {
      bottom: { style: "thin", color: { argb: hexToExcelArgb(theme.border) } },
    }
  })
}

export function setSheetColumns(
  sheet: ExcelJS.Worksheet,
  columns: ExcelColumn[]
) {
  sheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width,
  }))
}
