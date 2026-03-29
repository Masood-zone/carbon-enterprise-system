import { useQuery } from "@tanstack/react-query"

import { api } from "@/services/api/axios"

const dashboardQueryKeys = {
  root: ["admin", "dashboard"] as const,
}

export function useAdminDashboardQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.root,
    queryFn: async () => {
      const response = await api.get("/api/admin/dashboard")
      return response.data
    },
  })
}
