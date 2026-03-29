import { useQuery } from "@tanstack/react-query"

import { api } from "@/services/api/axios"

import {
  useBasicAnalyticsMetricQuery as useManagerAnalyticsMetricQuery,
  useBasicAnalyticsQuery as useManagerAnalyticsQuery,
} from "@/services/analytics/basic-analytics.query"
import {
  useBasicCashFlowQuery as useManagerCashFlowQuery,
  useBasicFinancialSummaryQuery as useManagerFinancialSummaryQuery,
  useBasicProfitLossQuery as useManagerProfitLossQuery,
} from "@/services/report/basic-report.query"

const managerDashboardQueryKeys = {
  root: ["manager", "dashboard"] as const,
}

export function useManagerDashboardQuery() {
  return useQuery({
    queryKey: managerDashboardQueryKeys.root,
    queryFn: async () => {
      const response = await api.get("/api/admin/dashboard")
      return response.data
    },
  })
}

export {
  useAdminInventoryMovementsQuery as useManagerInventoryMovementsQuery,
  useAdminInventoryQuery as useManagerInventoryQuery,
  useAdminLowStockQuery as useManagerLowStockQuery,
  useAdminProductQuery as useManagerProductQuery,
  useAdminProductsQuery as useManagerProductsQuery,
} from "@/services/product/product.query"
export {
  useAdminCustomerQuery as useManagerCustomerQuery,
  useAdminCustomersQuery as useManagerCustomersQuery,
} from "@/services/customer/customer.query"
export {
  useAdminExpenseQuery as useManagerExpenseQuery,
  useAdminExpensesQuery as useManagerExpensesQuery,
} from "@/services/expense/expense.query"
export {
  useAdminTransactionItemsQuery as useManagerTransactionItemsQuery,
  useAdminTransactionQuery as useManagerTransactionQuery,
  useAdminTransactionsQuery as useManagerTransactionsQuery,
} from "@/services/transaction/transaction.query"
export {
  useManagerAnalyticsMetricQuery,
  useManagerAnalyticsQuery,
  useManagerCashFlowQuery,
  useManagerFinancialSummaryQuery,
  useManagerProfitLossQuery,
}
