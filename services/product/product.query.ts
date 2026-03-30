import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"

import type { ProductInput, ProductUpdateInput } from "./product.service"

export type InventoryMovementInput = {
  movementType: string
  notes?: string
  productId: string
  quantity: number
}

const productQueryKeys = {
  all: ["admin", "products"] as const,
  detail: (id: string) => ["admin", "products", id] as const,
  inventory: ["admin", "inventory"] as const,
  lowStock: ["admin", "inventory", "low-stock"] as const,
  movements: ["admin", "inventory", "movements"] as const,
}

export function useAdminProductsQuery() {
  return useQuery({
    queryKey: productQueryKeys.all,
    queryFn: async () => {
      const response = await api.get("/api/admin/products")
      return response.data
    },
  })
}

export function useAdminProductQuery(productId: string) {
  return useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: async () => {
      const response = await api.get(`/api/admin/products/${productId}`)
      return response.data
    },
    enabled: Boolean(productId),
  })
}

export function useAdminInventoryQuery() {
  return useQuery({
    queryKey: productQueryKeys.inventory,
    queryFn: async () => {
      const response = await api.get("/api/admin/inventory")
      return response.data
    },
  })
}

export function useAdminLowStockQuery() {
  return useQuery({
    queryKey: productQueryKeys.lowStock,
    queryFn: async () => {
      const response = await api.get("/api/admin/inventory/low-stock")
      return response.data
    },
  })
}

export function useAdminInventoryMovementsQuery() {
  return useQuery({
    queryKey: productQueryKeys.movements,
    queryFn: async () => {
      const response = await api.get("/api/admin/inventory/movements")
      return response.data
    },
  })
}

export function useCreateInventoryMovementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: InventoryMovementInput) => {
      const response = await api.post("/api/admin/inventory/movements", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.inventory,
      })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.lowStock,
      })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.movements,
      })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.all,
      })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useCreateAdminProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const response = await api.post("/api/admin/products", input)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.inventory,
      })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.lowStock,
      })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useUpdateAdminProductMutation(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ProductUpdateInput) => {
      const response = await api.patch(
        `/api/admin/products/${productId}`,
        input
      )
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.inventory,
      })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.lowStock,
      })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(productId),
      })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useDeleteAdminProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(`/api/admin/products/${productId}`)
      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productQueryKeys.all })
      await queryClient.invalidateQueries({
        queryKey: productQueryKeys.inventory,
      })
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
