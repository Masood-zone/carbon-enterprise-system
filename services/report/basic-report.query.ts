import { useQuery } from "@tanstack/react-query"

import { api } from "@/services/api/axios"

const basicReportQueryKeys = {
  cashFlow: ["manager", "reports", "cash-flow"] as const,
  financialSummary: ["manager", "reports", "financial-summary"] as const,
  profitLoss: ["manager", "reports", "profit-loss"] as const,
}

export function useBasicFinancialSummaryQuery() {
  return useQuery({
    queryKey: basicReportQueryKeys.financialSummary,
    queryFn: async () => {
      const response = await api.get("/api/admin/reports/financial-summary")
      return response.data
    },
  })
}

export function useBasicProfitLossQuery() {
  return useQuery({
    queryKey: basicReportQueryKeys.profitLoss,
    queryFn: async () => {
      const response = await api.get("/api/admin/reports/profit-loss")
      return response.data
    },
  })
}

export function useBasicCashFlowQuery() {
  return useQuery({
    queryKey: basicReportQueryKeys.cashFlow,
    queryFn: async () => {
      const response = await api.get("/api/admin/reports/cash-flow")
      return response.data
    },
  })
}
