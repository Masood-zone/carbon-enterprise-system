import { prisma } from "@/lib/prisma"

export class TransactionItemService {
  static async listByTransaction(businessId: string, transactionId: string) {
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
