import { prisma } from "@/lib/prisma"

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
}
