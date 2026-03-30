import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type {
  CreateTransactionInput,
  TransactionFilters,
  UpdateTransactionInput,
} from "./transaction.service"

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

export function useCreateAdminTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTransactionInput) => {
      const response = await api.post("/api/admin/transactions", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.all,
      })
      await queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useUpdateAdminTransactionMutation(transactionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateTransactionInput) => {
      const response = await api.patch(
        `/api/admin/transactions/${transactionId}`,
        input
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.all,
      })
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.detail(transactionId),
      })
      await queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useVoidAdminTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await api.delete(
        `/api/admin/transactions/${transactionId}`
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.all,
      })
      await queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
