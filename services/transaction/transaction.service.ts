import { prisma } from "@/lib/prisma"
import {
  normalizeDate,
  normalizeNumber,
  normalizeOptionalString,
  normalizeString,
} from "@/services/shared/validation.service"

export type TransactionFilters = {
  customerId?: string
  endDate?: string | Date
  productId?: string
  startDate?: string | Date
}

export type TransactionLineInput = {
  discountAmount?: number
  price?: number
  productId: string
  quantity: number
}

export type CreateTransactionInput = {
  customerId?: string
  paymentMethod?: string
  reference?: string
  soldAt?: string | Date
  status?: string
  transactionNumber?: string
  items: TransactionLineInput[]
}

export type UpdateTransactionInput = {
  paymentMethod?: string
  reference?: string
  status?: string
  transactionNumber?: string
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

  static async create(
    businessId: string,
    soldByUserId: string,
    input: CreateTransactionInput
  ) {
    const soldAt = normalizeDate(input.soldAt) ?? new Date()
    const status = normalizeString(input.status || "COMPLETED").toUpperCase()
    const lineItems = Array.isArray(input.items) ? input.items : []

    if (!lineItems.length) {
      throw new Error("At least one line item is required")
    }

    return prisma.$transaction(async (tx) => {
      const productIds = Array.from(
        new Set(lineItems.map((item) => normalizeString(item.productId)))
      ).filter(Boolean)

      const products = await tx.product.findMany({
        where: {
          businessId,
          id: { in: productIds },
        },
        select: {
          id: true,
          stock: true,
          price: true,
          costPrice: true,
          isActive: true,
          name: true,
        },
      })

      const productMap = new Map(
        products.map((product) => [product.id, product])
      )

      const normalizedItems = lineItems.map((item) => {
        const productId = normalizeString(item.productId)
        const quantity = Math.trunc(normalizeNumber(item.quantity, Number.NaN))

        if (!productId) {
          throw new Error("Each line item requires a productId")
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
          throw new Error("Line item quantity must be a positive number")
        }

        const product = productMap.get(productId)

        if (!product) {
          throw new Error("One or more products were not found")
        }

        if (!product.isActive) {
          throw new Error(`Product '${product.name}' is inactive`)
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for '${product.name}'`)
        }

        const price =
          item.price !== undefined
            ? normalizeNumber(item.price)
            : normalizeNumber(product.price)
        const discountAmount = normalizeNumber(item.discountAmount ?? 0)
        const lineTotal = normalizeNumber(price * quantity - discountAmount)
        const costPrice =
          product.costPrice === null || product.costPrice === undefined
            ? null
            : normalizeNumber(product.costPrice)

        return {
          product,
          productId,
          quantity,
          price,
          discountAmount,
          lineTotal,
          costPrice,
        }
      })

      const subtotal = normalizedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
      const discountAmount = normalizedItems.reduce(
        (total, item) => total + item.discountAmount,
        0
      )
      const totalAmount = normalizedItems.reduce(
        (total, item) => total + item.lineTotal,
        0
      )
      const costAmount = normalizedItems.reduce(
        (total, item) => total + (item.costPrice ?? 0) * item.quantity,
        0
      )
      const profitAmount = totalAmount - costAmount

      const transaction = await tx.transaction.create({
        data: {
          businessId,
          customerId: normalizeOptionalString(input.customerId),
          soldByUserId,
          soldAt,
          status: status as never,
          paymentMethod: normalizeOptionalString(input.paymentMethod),
          reference: normalizeOptionalString(input.reference),
          transactionNumber: normalizeOptionalString(input.transactionNumber),
          subtotal: normalizeNumber(subtotal),
          discountAmount: normalizeNumber(discountAmount),
          taxAmount: 0,
          totalAmount: normalizeNumber(totalAmount),
          costAmount: normalizeNumber(costAmount),
          profitAmount: normalizeNumber(profitAmount),
        },
      })

      for (const item of normalizedItems) {
        const productBefore = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })

        if (!productBefore) {
          throw new Error("Product not found")
        }

        const stockDelta = -Math.abs(item.quantity)

        const updatedProduct = await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: stockDelta,
            },
          },
          select: { stock: true },
        })

        const transactionItem = await tx.transactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            costPrice: item.costPrice,
            discountAmount: item.discountAmount,
            lineTotal: item.lineTotal,
          },
        })

        await tx.stockMovement.create({
          data: {
            businessId,
            productId: item.productId,
            performedByUserId: soldByUserId,
            movementType: "SALE" as never,
            quantity: stockDelta,
            balanceBefore: productBefore.stock,
            balanceAfter: updatedProduct.stock,
            notes: "Sale transaction",
            transactionItemId: transactionItem.id,
          },
        })
      }

      if (input.customerId) {
        await tx.customer.updateMany({
          where: { id: normalizeString(input.customerId), businessId },
          data: {
            lastPurchaseAt: soldAt,
            lifetimeValue: {
              increment: normalizeNumber(totalAmount),
            },
          },
        })
      }

      return tx.transaction.findFirst({
        where: { id: transaction.id, businessId },
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
    })
  }

  static async update(
    businessId: string,
    transactionId: string,
    performedByUserId: string,
    input: UpdateTransactionInput
  ) {
    const status = input.status
      ? normalizeString(input.status).toUpperCase()
      : undefined

    if (status === "VOIDED" || status === "REFUNDED") {
      return this.void(businessId, transactionId, performedByUserId)
    }

    const result = await prisma.transaction.updateMany({
      where: { id: transactionId, businessId },
      data: {
        ...(input.paymentMethod !== undefined
          ? { paymentMethod: normalizeOptionalString(input.paymentMethod) }
          : {}),
        ...(input.reference !== undefined
          ? { reference: normalizeOptionalString(input.reference) }
          : {}),
        ...(input.transactionNumber !== undefined
          ? {
              transactionNumber: normalizeOptionalString(
                input.transactionNumber
              ),
            }
          : {}),
        ...(status !== undefined ? { status: status as never } : {}),
      },
    })

    if (!result.count) {
      return null
    }

    return this.getById(businessId, transactionId)
  }

  static async void(
    businessId: string,
    transactionId: string,
    performedByUserId: string
  ) {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: { id: transactionId, businessId },
        include: {
          items: true,
        },
      })

      if (!transaction) {
        return null
      }

      if (String(transaction.status).toUpperCase() === "VOIDED") {
        return tx.transaction.findFirst({
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

      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: "VOIDED" as never,
        },
      })

      for (const item of transaction.items) {
        const productBefore = await tx.product.findUnique({
          where: { id: item.productId },
          select: { stock: true },
        })

        if (!productBefore) {
          continue
        }

        const stockDelta = Math.abs(item.quantity)

        const updatedProduct = await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: stockDelta,
            },
          },
          select: { stock: true },
        })

        await tx.stockMovement.create({
          data: {
            businessId,
            productId: item.productId,
            performedByUserId,
            movementType: "RETURN" as never,
            quantity: stockDelta,
            balanceBefore: productBefore.stock,
            balanceAfter: updatedProduct.stock,
            notes: "Voided transaction",
            transactionItemId: item.id,
          },
        })
      }

      return tx.transaction.findFirst({
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
    })
  }
}
