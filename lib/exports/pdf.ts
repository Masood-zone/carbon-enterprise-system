import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib"

import type { ExportThemeTokens } from "./theme"

type PdfFontName = "Helvetica" | "Helvetica-Bold"

type PdfColor = ReturnType<typeof rgb>

type PdfCanvasState = {
  color: PdfColor
  cursorY: number
  font: PDFFont
  fontSize: number
}

export type PdfCanvas = {
  doc: PDFDocument
  fonts: {
    bold: PDFFont
    regular: PDFFont
  }
  margin: { bottom: number; left: number; right: number; top: number }
  page: PDFPage
  cursorY: number
  addPage: () => void
  fillColor: (value: string) => PdfCanvas
  font: (value: PdfFontName | string) => PdfCanvas
  fontSize: (value: number) => PdfCanvas
  moveDown: (value?: number) => PdfCanvas
  opacity: (_value: number) => PdfCanvas
  save: () => PdfCanvas
  restore: () => PdfCanvas
  setCursorY: (value: number) => void
  text: (
    value: string,
    xOrOptions?: number | Record<string, unknown>,
    y?: number,
    options?: Record<string, unknown>
  ) => PdfCanvas
}

export async function createPdfBuffer(
  render: (canvas: PdfCanvas) => void | Promise<void>
) {
  const doc = await PDFDocument.create()
  const regularFont = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  const canvas = createCanvas(doc, regularFont, boldFont)
  await render(canvas)

  const bytes = await doc.save()
  return Buffer.from(bytes)
}

export function drawPdfHeader(
  canvas: PdfCanvas,
  theme: ExportThemeTokens,
  options: {
    title: string
    subtitle?: string
    generatedAt?: Date
  }
) {
  const { title, subtitle, generatedAt } = options
  const pageWidth = canvas.page.getWidth()
  const pageHeight = canvas.page.getHeight()
  const headerHeight = 84

  drawRect(canvas.page, 0, pageHeight - headerHeight, pageWidth, headerHeight, {
    color: hexToRgb(theme.primary),
  })

  drawText(canvas.page, title, {
    color: hexToRgb(theme.primaryForeground),
    font: canvas.fonts.bold,
    fontSize: 18,
    maxWidth: pageWidth - 96,
    x: 48,
    y: pageHeight - 48,
  })

  const metaLine = generatedAt
    ? `Generated ${generatedAt.toLocaleString("en-GH")}`
    : null
  const secondary = [subtitle, metaLine].filter(Boolean).join(" · ")

  if (secondary) {
    drawText(canvas.page, secondary, {
      color: hexToRgb(theme.primaryForeground),
      font: canvas.fonts.regular,
      fontSize: 10,
      maxWidth: pageWidth - 96,
      opacity: 0.9,
      x: 48,
      y: pageHeight - 66,
    })
  }

  canvas.setCursorY(104)
}

export function drawPdfTable(
  canvas: PdfCanvas,
  theme: ExportThemeTokens,
  options: {
    columns: Array<{ key: string; label: string; width: number }>
    rows: Array<Record<string, string>>
    startY?: number
  }
) {
  const { columns, rows } = options
  const pageWidth = canvas.page.getWidth()
  const pageHeight = canvas.page.getHeight()
  const left = canvas.margin.left
  const right = canvas.margin.right
  const bottom = canvas.margin.bottom
  const maxWidth = pageWidth - left - right

  const totalWidth = columns.reduce((sum, column) => sum + column.width, 0)
  const scale = totalWidth > maxWidth ? maxWidth / totalWidth : 1
  const colWidths = columns.map((column) => column.width * scale)

  const rowHeight = 18
  const headerHeight = 22
  let y = options.startY ?? canvas.cursorY

  const drawHeaderRow = (topY: number) => {
    drawRect(
      canvas.page,
      left,
      pageHeight - topY - headerHeight,
      maxWidth,
      headerHeight,
      {
        borderColor: hexToRgb(theme.border),
        borderWidth: 1,
        color: hexToRgb(theme.card),
      }
    )

    let x = left
    columns.forEach((column, index) => {
      const width = colWidths[index]
      drawText(canvas.page, column.label, {
        color: hexToRgb(theme.foreground),
        font: canvas.fonts.bold,
        fontSize: 9,
        maxWidth: width - 12,
        x: x + 6,
        y: pageHeight - topY - 15,
      })
      x += width
    })
  }

  drawHeaderRow(y)
  y += headerHeight

  for (const row of rows) {
    if (y + rowHeight > pageHeight - bottom) {
      canvas.addPage()
      y = canvas.cursorY
      drawHeaderRow(y)
      y += headerHeight
    }

    let x = left
    columns.forEach((column, index) => {
      const width = colWidths[index]
      const value = row[column.key] ?? ""
      drawText(canvas.page, value, {
        color: hexToRgb(theme.mutedForeground),
        font: canvas.fonts.regular,
        fontSize: 9,
        maxWidth: width - 12,
        x: x + 6,
        y: pageHeight - y - 13,
      })
      x += width
    })

    drawLine(
      canvas.page,
      left,
      pageHeight - y - rowHeight,
      left + maxWidth,
      pageHeight - y - rowHeight,
      {
        color: hexToRgb(theme.border),
        width: 1,
      }
    )

    y += rowHeight
  }

  canvas.setCursorY(y + 6)
}

function createCanvas(
  doc: PDFDocument,
  regularFont: PDFFont,
  boldFont: PDFFont
) {
  const margin = { bottom: 48, left: 48, right: 48, top: 48 }
  const page = doc.addPage()

  const state: PdfCanvasState = {
    color: rgb(0.1019607843, 0.1019607843, 0.1019607843),
    cursorY: margin.top,
    font: regularFont,
    fontSize: 10,
  }

  const canvas: PdfCanvas = {
    doc,
    fonts: {
      bold: boldFont,
      regular: regularFont,
    },
    margin,
    page,
    get cursorY() {
      return state.cursorY
    },
    addPage: () => {
      canvas.page = doc.addPage()
      state.cursorY = margin.top
    },
    fillColor: (value) => {
      state.color = hexToRgb(value)
      return canvas
    },
    font: (value) => {
      state.font = value.toLowerCase().includes("bold") ? boldFont : regularFont
      return canvas
    },
    fontSize: (value) => {
      state.fontSize = value
      return canvas
    },
    moveDown: (value = 1) => {
      state.cursorY += state.fontSize * 1.25 * value
      return canvas
    },
    opacity: () => canvas,
    save: () => canvas,
    restore: () => canvas,
    setCursorY: (value) => {
      state.cursorY = value
    },
    text: (value, xOrOptions, y, options) => {
      const parsed = normalizeTextArgs(xOrOptions, y, options)
      const x = parsed.x ?? margin.left
      const topY = parsed.y ?? state.cursorY
      drawText(canvas.page, value, {
        color: state.color,
        font: state.font,
        fontSize: state.fontSize,
        maxWidth: parsed.maxWidth,
        x,
        y: page.getHeight() - topY - state.fontSize,
      })
      return canvas
    },
  }

  return canvas
}

function normalizeTextArgs(
  xOrOptions?: number | Record<string, unknown>,
  y?: number,
  options?: Record<string, unknown>
) {
  if (typeof xOrOptions === "number") {
    return {
      maxWidth: normalizeNumber(options?.width ?? options?.maxWidth),
      x: xOrOptions,
      y,
    }
  }

  if (typeof xOrOptions === "object" && xOrOptions !== null) {
    return {
      maxWidth: normalizeNumber(xOrOptions.width ?? xOrOptions.maxWidth),
      x: normalizeNumber(xOrOptions.x),
      y: normalizeNumber(xOrOptions.y),
    }
  }

  return {
    maxWidth: normalizeNumber(options?.width ?? options?.maxWidth),
    x: undefined,
    y,
  }
}

function drawRect(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  options: {
    borderColor?: PdfColor
    borderWidth?: number
    color?: PdfColor
  }
) {
  page.drawRectangle({
    borderColor: options.borderColor,
    borderWidth: options.borderWidth,
    color: options.color,
    height,
    opacity: 1,
    width,
    x,
    y,
  })
}

function drawLine(
  page: PDFPage,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  options: { color: PdfColor; width: number }
) {
  page.drawLine({
    color: options.color,
    end: { x: endX, y: endY },
    start: { x: startX, y: startY },
    thickness: options.width,
  })
}

function drawText(
  page: PDFPage,
  value: string,
  options: {
    color: PdfColor
    font: PDFFont
    fontSize: number
    maxWidth?: number
    opacity?: number
    x: number
    y: number
  }
) {
  page.drawText(value, {
    color: options.color,
    font: options.font,
    lineHeight: options.fontSize * 1.2,
    maxWidth: options.maxWidth,
    opacity: options.opacity ?? 1,
    size: options.fontSize,
    x: options.x,
    y: options.y,
  })
}

function hexToRgb(value: string): PdfColor {
  const normalized = value.trim().replace(/^#/, "")
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => character + character)
          .join("")
      : normalized

  const red = Number.parseInt(expanded.slice(0, 2), 16)
  const green = Number.parseInt(expanded.slice(2, 4), 16)
  const blue = Number.parseInt(expanded.slice(4, 6), 16)

  return rgb(red / 255, green / 255, blue / 255)
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" ? value : undefined
}
