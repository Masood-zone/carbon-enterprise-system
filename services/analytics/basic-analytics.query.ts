import { useQuery } from "@tanstack/react-query"

import { api } from "@/services/api/axios"

const basicAnalyticsQueryKeys = {
  all: ["manager", "analytics"] as const,
  metric: (metric: string) => ["manager", "analytics", metric] as const,
}

export function useBasicAnalyticsQuery() {
  return useQuery({
    queryKey: basicAnalyticsQueryKeys.all,
    queryFn: async () => {
      const response = await api.get("/api/admin/analytics")
      return response.data
    },
  })
}

export function useBasicAnalyticsMetricQuery(metric: string) {
  return useQuery({
    queryKey: basicAnalyticsQueryKeys.metric(metric),
    queryFn: async () => {
      const response = await api.get(`/api/admin/analytics/${metric}`)
      return response.data
    },
    enabled: Boolean(metric),
  })
}
