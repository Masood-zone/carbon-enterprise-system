import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type { UserCreateInput, UserUpdateInput } from "./user.service"

const userQueryKeys = {
  all: ["admin", "users"] as const,
  detail: (id: string) => ["admin", "users", id] as const,
}

export function useAdminUsersQuery() {
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: async () => {
      const response = await api.get("/api/admin/users")
      return response.data
    },
  })
}

export function useAdminUserQuery(userId: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(userId),
    queryFn: async () => {
      const response = await api.get(`/api/admin/users/${userId}`)
      return response.data
    },
    enabled: Boolean(userId),
  })
}

export function useCreateAdminUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UserCreateInput) => {
      const response = await api.post("/api/admin/users", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useUpdateAdminUserMutation(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UserUpdateInput) => {
      const response = await api.patch(`/api/admin/users/${userId}`, input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useDeleteAdminUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await api.delete(`/api/admin/users/${userId}`)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.all })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
