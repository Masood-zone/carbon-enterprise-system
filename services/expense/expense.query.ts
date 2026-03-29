import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type { ExpenseFilters, ExpenseInput, ExpenseUpdateInput } from "./expense.service"

const expenseQueryKeys = {
  all: ["admin", "expenses"] as const,
  detail: (id: string) => ["admin", "expenses", id] as const,
}

function buildExpenseParams(filters: ExpenseFilters = {}) {
  const params = new URLSearchParams()

  if (filters.startDate) params.set("startDate", String(filters.startDate))
  if (filters.endDate) params.set("endDate", String(filters.endDate))

  return params
}

export function useAdminExpensesQuery(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: [...expenseQueryKeys.all, filters],
    queryFn: async () => {
      const params = buildExpenseParams(filters)
      const response = await api.get(`/api/admin/expenses?${params.toString()}`)
      return response.data
    },
  })
}

export function useAdminExpenseQuery(expenseId: string) {
  return useQuery({
    queryKey: expenseQueryKeys.detail(expenseId),
    queryFn: async () => {
      const response = await api.get(`/api/admin/expenses/${expenseId}`)
      return response.data
    },
    enabled: Boolean(expenseId),
  })
}

export function useCreateAdminExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ExpenseInput) => {
      const response = await api.post("/api/admin/expenses", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: expenseQueryKeys.all })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useUpdateAdminExpenseMutation(expenseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ExpenseUpdateInput) => {
      const response = await api.patch(`/api/admin/expenses/${expenseId}`, input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: expenseQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: expenseQueryKeys.detail(expenseId) })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useDeleteAdminExpenseMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (expenseId: string) => {
      const response = await api.delete(`/api/admin/expenses/${expenseId}`)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: expenseQueryKeys.all })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
