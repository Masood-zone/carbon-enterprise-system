import { prisma } from "@/lib/prisma"

export class MetricsService {
  static async computeRevenue(businessId: string) {
    const aggregate = await prisma.transaction.aggregate({
      where: { businessId },
      _sum: {
        totalAmount: true,
      },
    })

    return aggregate._sum.totalAmount ?? 0
  }

  static async computeExpenses(businessId: string) {
    const aggregate = await prisma.expense.aggregate({
      where: { businessId },
      _sum: {
        amount: true,
      },
    })

    return aggregate._sum.amount ?? 0
  }

  static async computeProfit(businessId: string) {
    const [revenue, expenses] = await Promise.all([
      this.computeRevenue(businessId),
      this.computeExpenses(businessId),
    ])

    return revenue - expenses
  }

  static async computeInventoryTurnover(businessId: string) {
    const [products, movementAggregate] = await Promise.all([
      prisma.product.aggregate({
        where: { businessId },
        _sum: { stock: true },
      }),
      prisma.stockMovement.aggregate({
        where: {
          businessId,
          movementType: {
            in: ["SALE", "COUNT", "ADJUSTMENT"],
          },
        },
        _sum: { quantity: true },
      }),
    ])

    const stockValue = products._sum.stock ?? 0
    const movedQuantity = movementAggregate._sum.quantity ?? 0

    if (!stockValue) {
      return 0
    }

    return movedQuantity / stockValue
  }
}
