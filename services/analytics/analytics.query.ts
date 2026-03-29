import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type { AnalyticsMetricKey } from "./analytics.service"

const analyticsQueryKeys = {
  all: ["admin", "analytics"] as const,
  metric: (metric: string) => ["admin", "analytics", metric] as const,
}

export function useAdminAnalyticsQuery() {
  return useQuery({
    queryKey: analyticsQueryKeys.all,
    queryFn: async () => {
      const response = await api.get("/api/admin/analytics")
      return response.data
    },
  })
}

export function useAdminAnalyticsMetricQuery(metric: string) {
  return useQuery({
    queryKey: analyticsQueryKeys.metric(metric),
    queryFn: async () => {
      const response = await api.get(`/api/admin/analytics/${metric}`)
      return response.data
    },
    enabled: Boolean(metric),
  })
}

export function useRecomputeAdminAnalyticsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input?: { metrics?: AnalyticsMetricKey[] }) => {
      const response = await api.post(
        "/api/admin/analytics/recompute",
        input ?? {}
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: analyticsQueryKeys.all })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
