import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type {
  BusinessProfileUpdateInput,
  BusinessSettingsInput,
} from "./business.service"

const businessQueryKeys = {
  profile: ["admin", "business", "profile"] as const,
  settings: ["admin", "business", "settings"] as const,
}

export function useAdminBusinessProfileQuery() {
  return useQuery({
    queryKey: businessQueryKeys.profile,
    queryFn: async () => {
      const response = await api.get("/api/admin/business")
      return response.data
    },
  })
}

export function useAdminBusinessSettingsQuery() {
  return useQuery({
    queryKey: businessQueryKeys.settings,
    queryFn: async () => {
      const response = await api.get("/api/admin/settings")
      return response.data
    },
  })
}

export function useUpdateAdminBusinessMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BusinessProfileUpdateInput) => {
      const response = await api.patch("/api/admin/business", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.profile,
      })
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.settings,
      })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useUpdateAdminBusinessSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BusinessSettingsInput) => {
      const response = await api.patch("/api/admin/settings", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.profile,
      })
      await queryClient.invalidateQueries({
        queryKey: businessQueryKeys.settings,
      })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
