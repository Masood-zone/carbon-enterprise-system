import { prisma } from "@/lib/prisma"
import {
  normalizeNumber,
  normalizeOptionalString,
  normalizeString,
} from "@/services/shared/validation.service"

export type ProductInput = {
  barcode?: string
  category?: string
  costPrice?: number | null
  description?: string
  isActive?: boolean
  leadTimeDays?: number | null
  name: string
  price: number
  quantity?: number
  reorderPoint?: number
  reorderQuantity?: number | null
  safetyStock?: number
  sku?: string
  stock?: number
  unitOfMeasure?: string
}

export type ProductUpdateInput = Partial<ProductInput>

export class ProductService {
  static async listByBusiness(businessId: string) {
    return prisma.product.findMany({
      where: { businessId },
      orderBy: { updatedAt: "desc" },
    })
  }

  static async getById(businessId: string, productId: string) {
    return prisma.product.findFirst({
      where: { id: productId, businessId },
    })
  }

  static async create(businessId: string, input: ProductInput) {
    return prisma.product.create({
      data: {
        businessId,
        name: normalizeString(input.name),
        price: normalizeNumber(input.price),
        stock: normalizeNumber(input.stock ?? input.quantity ?? 0),
        barcode: normalizeOptionalString(input.barcode),
        category: normalizeOptionalString(input.category),
        costPrice:
          input.costPrice === null || input.costPrice === undefined
            ? null
            : normalizeNumber(input.costPrice),
        description: normalizeOptionalString(input.description),
        isActive: input.isActive ?? true,
        leadTimeDays:
          input.leadTimeDays === null || input.leadTimeDays === undefined
            ? null
            : normalizeNumber(input.leadTimeDays),
        reorderPoint: normalizeNumber(input.reorderPoint ?? 0),
        reorderQuantity:
          input.reorderQuantity === null || input.reorderQuantity === undefined
            ? null
            : normalizeNumber(input.reorderQuantity),
        safetyStock: normalizeNumber(input.safetyStock ?? 0),
        sku: normalizeOptionalString(input.sku),
        unitOfMeasure: normalizeOptionalString(input.unitOfMeasure),
      },
    })
  }

  static async update(
    businessId: string,
    productId: string,
    input: ProductUpdateInput
  ) {
    return prisma.product.updateMany({
      where: { id: productId, businessId },
      data: {
        ...(input.barcode !== undefined
          ? { barcode: normalizeOptionalString(input.barcode) }
          : {}),
        ...(input.category !== undefined
          ? { category: normalizeOptionalString(input.category) }
          : {}),
        ...(input.costPrice !== undefined
          ? {
              costPrice:
                input.costPrice === null
                  ? null
                  : normalizeNumber(input.costPrice),
            }
          : {}),
        ...(input.description !== undefined
          ? { description: normalizeOptionalString(input.description) }
          : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
        ...(input.leadTimeDays !== undefined
          ? {
              leadTimeDays:
                input.leadTimeDays === null
                  ? null
                  : normalizeNumber(input.leadTimeDays),
            }
          : {}),
        ...(input.name !== undefined ? { name: normalizeString(input.name) } : {}),
        ...(input.price !== undefined ? { price: normalizeNumber(input.price) } : {}),
        ...(input.reorderPoint !== undefined
          ? { reorderPoint: normalizeNumber(input.reorderPoint) }
          : {}),
        ...(input.reorderQuantity !== undefined
          ? {
              reorderQuantity:
                input.reorderQuantity === null
                  ? null
                  : normalizeNumber(input.reorderQuantity),
            }
          : {}),
        ...(input.safetyStock !== undefined
          ? { safetyStock: normalizeNumber(input.safetyStock) }
          : {}),
        ...(input.sku !== undefined ? { sku: normalizeOptionalString(input.sku) } : {}),
        ...(input.stock !== undefined ? { stock: normalizeNumber(input.stock) } : {}),
        ...(input.unitOfMeasure !== undefined
          ? { unitOfMeasure: normalizeOptionalString(input.unitOfMeasure) }
          : {}),
      },
    })
  }

  static async delete(businessId: string, productId: string) {
    return prisma.product.deleteMany({
      where: { id: productId, businessId },
    })
  }
}
