import { prisma } from "@/lib/prisma"
import { normalizeDate } from "@/services/shared/validation.service"

export type TransactionFilters = {
  customerId?: string
  endDate?: string | Date
  productId?: string
  startDate?: string | Date
}

export class TransactionService {
  static async listByBusiness(
    businessId: string,
    filters: TransactionFilters = {}
  ) {
    const startDate = normalizeDate(filters.startDate)
    const endDate = normalizeDate(filters.endDate)

    return prisma.transaction.findMany({
      where: {
        businessId,
        ...(filters.customerId ? { customerId: filters.customerId } : {}),
        ...(startDate || endDate
          ? {
              soldAt: {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              },
            }
          : {}),
        ...(filters.productId
          ? {
              items: {
                some: {
                  productId: filters.productId,
                },
              },
            }
          : {}),
      },
      orderBy: { soldAt: "desc" },
      include: {
        customer: true,
        soldBy: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  static async getById(businessId: string, transactionId: string) {
    return prisma.transaction.findFirst({
      where: { id: transactionId, businessId },
      include: {
        customer: true,
        soldBy: true,
        items: {
          include: {
            product: true,
            stockMovements: true,
          },
        },
      },
    })
  }

  static async listItems(businessId: string, transactionId: string) {
    return prisma.transactionItem.findMany({
      where: {
        transactionId,
        transaction: {
          businessId,
        },
      },
      include: {
        product: true,
        stockMovements: true,
      },
      orderBy: { id: "asc" },
    })
  }
}
