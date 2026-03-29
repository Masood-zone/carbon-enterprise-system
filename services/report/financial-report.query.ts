import { useQuery } from "@tanstack/react-query"

import { api } from "@/services/api/axios"

const reportQueryKeys = {
  cashFlow: ["admin", "reports", "cash-flow"] as const,
  financialSummary: ["admin", "reports", "financial-summary"] as const,
  profitLoss: ["admin", "reports", "profit-loss"] as const,
}

export function useFinancialSummaryQuery() {
  return useQuery({
    queryKey: reportQueryKeys.financialSummary,
    queryFn: async () => {
      const response = await api.get("/api/admin/reports/financial-summary")
      return response.data
    },
  })
}

export function useProfitLossQuery() {
  return useQuery({
    queryKey: reportQueryKeys.profitLoss,
    queryFn: async () => {
      const response = await api.get("/api/admin/reports/profit-loss")
      return response.data
    },
  })
}

export function useCashFlowQuery() {
  return useQuery({
    queryKey: reportQueryKeys.cashFlow,
    queryFn: async () => {
      const response = await api.get("/api/admin/reports/cash-flow")
      return response.data
    },
  })
}
