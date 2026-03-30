import fs from "node:fs/promises"
import path from "node:path"

export type ExportThemeTokens = {
  background: string
  foreground: string
  card: string
  mutedForeground: string
  border: string
  primary: string
  primaryForeground: string
}

let cachedTokens: ExportThemeTokens | null = null

export async function getExportThemeTokens(): Promise<ExportThemeTokens> {
  if (cachedTokens) return cachedTokens

  try {
    const globalsPath = path.join(process.cwd(), "app", "globals.css")
    const css = await fs.readFile(globalsPath, "utf8")

    const rootBlock = extractCssBlock(css, ":root")
    const tokens: ExportThemeTokens = {
      background: readCssVar(rootBlock, "--background") ?? "#ffffff",
      foreground: readCssVar(rootBlock, "--foreground") ?? "#000000",
      card: readCssVar(rootBlock, "--card") ?? "#ffffff",
      mutedForeground: readCssVar(rootBlock, "--muted-foreground") ?? "#525252",
      border: readCssVar(rootBlock, "--border") ?? "#e0e0e0",
      primary: readCssVar(rootBlock, "--primary") ?? "#0f62fe",
      primaryForeground:
        readCssVar(rootBlock, "--primary-foreground") ?? "#ffffff",
    }

    cachedTokens = tokens
    return tokens
  } catch {
    cachedTokens = {
      background: "#ffffff",
      foreground: "#000000",
      card: "#f4f4f4",
      mutedForeground: "#525252",
      border: "#e0e0e0",
      primary: "#0f62fe",
      primaryForeground: "#ffffff",
    }

    return cachedTokens
  }
}

export function hexToExcelArgb(hex: string) {
  const normalized = normalizeHex(hex)
  return `FF${normalized.slice(1).toUpperCase()}`
}

function normalizeHex(value: string) {
  const raw = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const r = raw[1]
    const g = raw[2]
    const b = raw[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return "#000000"
}

function extractCssBlock(css: string, selector: string) {
  const expression = new RegExp(
    `${escapeRegex(selector)}\\s*\\{([\\s\\S]*?)\\}`
  )
  const match = css.match(expression)
  return match?.[1] ?? ""
}

function readCssVar(block: string, variableName: string) {
  const expression = new RegExp(`${escapeRegex(variableName)}\\s*:\\s*([^;]+);`)
  const match = block.match(expression)
  return match?.[1]?.trim() ?? null
}

function escapeRegex(value: string) {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
