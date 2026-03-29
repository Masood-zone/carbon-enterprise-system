import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type { CustomerInput, CustomerUpdateInput } from "./customer.service"

const customerQueryKeys = {
  all: ["admin", "customers"] as const,
  detail: (id: string) => ["admin", "customers", id] as const,
}

export function useAdminCustomersQuery() {
  return useQuery({
    queryKey: customerQueryKeys.all,
    queryFn: async () => {
      const response = await api.get("/api/admin/customers")
      return response.data
    },
  })
}

export function useAdminCustomerQuery(customerId: string) {
  return useQuery({
    queryKey: customerQueryKeys.detail(customerId),
    queryFn: async () => {
      const response = await api.get(`/api/admin/customers/${customerId}`)
      return response.data
    },
    enabled: Boolean(customerId),
  })
}

export function useCreateAdminCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CustomerInput) => {
      const response = await api.post("/api/admin/customers", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useUpdateAdminCustomerMutation(customerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CustomerUpdateInput) => {
      const response = await api.patch(
        `/api/admin/customers/${customerId}`,
        input
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
      await queryClient.invalidateQueries({
        queryKey: customerQueryKeys.detail(customerId),
      })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useDeleteAdminCustomerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (customerId: string) => {
      const response = await api.delete(`/api/admin/customers/${customerId}`)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: customerQueryKeys.all })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
