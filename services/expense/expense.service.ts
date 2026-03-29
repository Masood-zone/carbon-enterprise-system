import { prisma } from "@/lib/prisma"
import {
  normalizeDate,
  normalizeNumber,
  normalizeOptionalString,
  normalizeString,
} from "@/services/shared/validation.service"

export type ExpenseInput = {
  amount: number
  category: string
  occurredAt?: string | Date
  notes?: string
  title: string
  vendorName?: string
}

export type ExpenseUpdateInput = Partial<ExpenseInput>

export type ExpenseFilters = {
  endDate?: string | Date
  startDate?: string | Date
}

export class ExpenseService {
  static async listByBusiness(
    businessId: string,
    filters: ExpenseFilters = {}
  ) {
    const startDate = normalizeDate(filters.startDate)
    const endDate = normalizeDate(filters.endDate)

    return prisma.expense.findMany({
      where: {
        businessId,
        ...(startDate || endDate
          ? {
              occurredAt: {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              },
            }
          : {}),
      },
      orderBy: { occurredAt: "desc" },
    })
  }

  static async getById(businessId: string, expenseId: string) {
    return prisma.expense.findFirst({
      where: { id: expenseId, businessId },
    })
  }

  static async create(businessId: string, input: ExpenseInput) {
    return prisma.expense.create({
      data: {
        businessId,
        amount: normalizeNumber(input.amount),
        category: normalizeString(input.category),
        title: normalizeString(input.title),
        notes: normalizeOptionalString(input.notes),
        vendorName: normalizeOptionalString(input.vendorName),
        ...(input.occurredAt
          ? { occurredAt: normalizeDate(input.occurredAt) ?? new Date() }
          : {}),
      },
    })
  }

  static async update(
    businessId: string,
    expenseId: string,
    input: ExpenseUpdateInput
  ) {
    return prisma.expense.updateMany({
      where: { id: expenseId, businessId },
      data: {
        ...(input.amount !== undefined
          ? { amount: normalizeNumber(input.amount) }
          : {}),
        ...(input.category !== undefined
          ? { category: normalizeString(input.category) }
          : {}),
        ...(input.notes !== undefined
          ? { notes: normalizeOptionalString(input.notes) }
          : {}),
        ...(input.title !== undefined
          ? { title: normalizeString(input.title) }
          : {}),
        ...(input.vendorName !== undefined
          ? { vendorName: normalizeOptionalString(input.vendorName) }
          : {}),
        ...(input.occurredAt !== undefined
          ? {
              occurredAt: normalizeDate(input.occurredAt) ?? new Date(),
            }
          : {}),
      },
    })
  }

  static async delete(businessId: string, expenseId: string) {
    return prisma.expense.deleteMany({
      where: { id: expenseId, businessId },
    })
  }
}
