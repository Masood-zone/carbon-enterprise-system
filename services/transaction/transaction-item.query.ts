import { useQuery } from "@tanstack/react-query"

import { api } from "@/services/api/axios"

const transactionItemQueryKeys = {
  byTransaction: (transactionId: string) => [
    "admin",
    "transaction-items",
    transactionId,
  ] as const,
}

export function useTransactionItemsQuery(transactionId: string) {
  return useQuery({
    queryKey: transactionItemQueryKeys.byTransaction(transactionId),
    queryFn: async () => {
      const response = await api.get(`/api/admin/transaction-items/${transactionId}`)
      return response.data
    },
    enabled: Boolean(transactionId),
  })
}
