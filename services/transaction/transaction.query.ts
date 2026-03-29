import { useQuery } from "@tanstack/react-query"

import { api } from "@/services/api/axios"

import type { TransactionFilters } from "./transaction.service"

const transactionQueryKeys = {
  all: ["admin", "transactions"] as const,
  detail: (id: string) => ["admin", "transactions", id] as const,
  items: (id: string) => ["admin", "transaction-items", id] as const,
}

function buildTransactionParams(filters: TransactionFilters = {}) {
  const params = new URLSearchParams()

  if (filters.startDate) params.set("startDate", String(filters.startDate))
  if (filters.endDate) params.set("endDate", String(filters.endDate))
  if (filters.productId) params.set("productId", filters.productId)
  if (filters.customerId) params.set("customerId", filters.customerId)

  return params
}

export function useAdminTransactionsQuery(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: [...transactionQueryKeys.all, filters],
    queryFn: async () => {
      const params = buildTransactionParams(filters)
      const response = await api.get(
        `/api/admin/transactions?${params.toString()}`
      )
      return response.data
    },
  })
}

export function useAdminTransactionQuery(transactionId: string) {
  return useQuery({
    queryKey: transactionQueryKeys.detail(transactionId),
    queryFn: async () => {
      const response = await api.get(`/api/admin/transactions/${transactionId}`)
      return response.data
    },
    enabled: Boolean(transactionId),
  })
}

export function useAdminTransactionItemsQuery(transactionId: string) {
  return useQuery({
    queryKey: transactionQueryKeys.items(transactionId),
    queryFn: async () => {
      const response = await api.get(
        `/api/admin/transaction-items/${transactionId}`
      )
      return response.data
    },
    enabled: Boolean(transactionId),
  })
}
