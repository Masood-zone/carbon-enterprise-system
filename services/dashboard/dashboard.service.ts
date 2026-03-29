import { prisma } from "@/lib/prisma"

export class DashboardService {
  static async getDashboard(businessId: string) {
    const [transactions, products, expenseAggregate, revenueAggregate] =
      await Promise.all([
        prisma.transaction.findMany({
          where: { businessId },
          orderBy: { soldAt: "desc" },
          take: 10,
          include: {
            customer: true,
            items: {
              include: { product: true },
            },
          },
        }),
        prisma.product.findMany({
          where: { businessId },
          orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
          take: 10,
        }),
        prisma.expense.aggregate({
          where: { businessId },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { businessId },
          _sum: { totalAmount: true },
        }),
      ])

    const lowStock = products.filter(
      (product) => product.stock < product.reorderPoint
    )
    const topProducts = await prisma.transactionItem.groupBy({
      by: ["productId"],
      where: {
        transaction: {
          businessId,
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    })

    const topProductIds = topProducts.map((entry) => entry.productId)
    const topProductDetails = await prisma.product.findMany({
      where: {
        businessId,
        id: {
          in: topProductIds,
        },
      },
    })

    return {
      expenses: expenseAggregate._sum.amount ?? 0,
      lowStock,
      profit:
        (revenueAggregate._sum.totalAmount ?? 0) -
        (expenseAggregate._sum.amount ?? 0),
      recentTransactions: transactions,
      revenue: revenueAggregate._sum.totalAmount ?? 0,
      topProducts: topProductDetails.map((product) => ({
        ...product,
        soldQuantity:
          topProducts.find((entry) => entry.productId === product.id)?._sum
            .quantity ?? 0,
      })),
    }
  }
}
