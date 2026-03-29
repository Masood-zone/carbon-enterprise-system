export type PaginationInput = {
  cursor?: string | null
  limit?: number | null
  offset?: number | null
}

export function normalizePagination(input: PaginationInput = {}) {
  const limit = Math.min(Math.max(input.limit ?? 20, 1), 100)
  const offset = Math.max(input.offset ?? 0, 0)

  return {
    cursor: input.cursor?.trim() || undefined,
    limit,
    offset,
    skip: offset,
    take: limit,
  }
}
