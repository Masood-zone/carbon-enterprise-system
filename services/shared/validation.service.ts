export function normalizeString(value: unknown, fallback = "") {
  if (typeof value !== "string") {
    return fallback
  }

  return value.trim()
}

export function normalizeOptionalString(value: unknown) {
  const normalized = normalizeString(value)

  return normalized ? normalized : undefined
}

export function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue)) {
      return parsedValue
    }
  }

  return fallback
}

export function normalizeOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return undefined
  }

  const normalized = normalizeNumber(value, Number.NaN)

  return Number.isNaN(normalized) ? undefined : normalized
}

export function normalizeDate(value: unknown) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = new Date(value)

    if (!Number.isNaN(parsedValue.getTime())) {
      return parsedValue
    }
  }

  return undefined
}
