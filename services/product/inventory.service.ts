import { prisma } from "@/lib/prisma"

export type InventoryMovementInput = {
  productId: string
  movementType: string
  notes?: string
  quantity: number
}

export class InventoryService {
  static async listInventory(businessId: string) {
    return prisma.product.findMany({
      where: { businessId },
      orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        name: true,
        sku: true,
        barcode: true,
        category: true,
        stock: true,
        reservedStock: true,
        reorderPoint: true,
        reorderQuantity: true,
        safetyStock: true,
        costPrice: true,
        price: true,
        isActive: true,
        updatedAt: true,
      },
    })
  }

  static async listLowStock(businessId: string, threshold: number) {
    return prisma.product.findMany({
      where: {
        businessId,
        stock: {
          lt: threshold,
        },
      },
      orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        reorderPoint: true,
        reorderQuantity: true,
        safetyStock: true,
        price: true,
        costPrice: true,
      },
    })
  }

  static async listMovements(businessId: string, productId?: string) {
    return prisma.stockMovement.findMany({
      where: {
        businessId,
        ...(productId ? { productId } : {}),
      },
      orderBy: { recordedAt: "desc" },
      include: {
        product: true,
        performedBy: true,
        transactionItem: true,
        purchaseOrderItem: true,
      },
    })
  }

  static async recordMovement(
    businessId: string,
    performedByUserId: string,
    input: InventoryMovementInput
  ) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: { id: input.productId, businessId },
        select: { id: true, stock: true },
      })

      if (!product) {
        throw new Error("Product not found")
      }

      const balanceBefore = product.stock
      const quantity = Number(input.quantity)

      if (!Number.isFinite(quantity) || quantity === 0) {
        throw new Error("Quantity must be a non-zero number")
      }

      const updatedProduct = await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            increment: quantity,
          },
        },
        select: { stock: true },
      })

      const movement = await tx.stockMovement.create({
        data: {
          businessId,
          productId: product.id,
          performedByUserId,
          movementType: input.movementType as never,
          quantity,
          balanceBefore,
          balanceAfter: updatedProduct.stock,
          notes: input.notes,
        },
        include: {
          product: true,
          performedBy: true,
        },
      })

      return movement
    })
  }
}
