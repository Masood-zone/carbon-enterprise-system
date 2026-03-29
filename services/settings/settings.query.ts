import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type { BusinessSettingsInput } from "@/services/business/business.service"

const settingsQueryKeys = {
  root: ["admin", "settings"] as const,
}

export function useAdminSettingsQuery() {
  return useQuery({
    queryKey: settingsQueryKeys.root,
    queryFn: async () => {
      const response = await api.get("/api/admin/settings")
      return response.data
    },
  })
}

export function useUpdateAdminSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: BusinessSettingsInput) => {
      const response = await api.patch("/api/admin/settings", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: settingsQueryKeys.root })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
