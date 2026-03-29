import { prisma } from "@/lib/prisma"
import {
  normalizeOptionalString,
  normalizeString,
} from "@/services/shared/validation.service"

export type CustomerInput = {
  email?: string
  name: string
  notes?: string
  phone?: string
  segment?: string
}

export type CustomerUpdateInput = Partial<CustomerInput> & {
  isActive?: boolean
}

export class CustomerService {
  static async listByBusiness(businessId: string) {
    return prisma.customer.findMany({
      where: { businessId },
      orderBy: { updatedAt: "desc" },
    })
  }

  static async getById(businessId: string, customerId: string) {
    return prisma.customer.findFirst({
      where: { id: customerId, businessId },
      include: {
        transactions: {
          orderBy: { soldAt: "desc" },
          take: 20,
          include: {
            items: {
              include: { product: true },
            },
          },
        },
      },
    })
  }

  static async create(businessId: string, input: CustomerInput) {
    return prisma.customer.create({
      data: {
        businessId,
        name: normalizeString(input.name),
        email: normalizeOptionalString(input.email)?.toLowerCase(),
        notes: normalizeOptionalString(input.notes),
        phone: normalizeOptionalString(input.phone),
        segment: normalizeOptionalString(input.segment),
      },
    })
  }

  static async update(
    businessId: string,
    customerId: string,
    input: CustomerUpdateInput
  ) {
    return prisma.customer.updateMany({
      where: { id: customerId, businessId },
      data: {
        ...(input.email !== undefined
          ? { email: normalizeOptionalString(input.email)?.toLowerCase() }
          : {}),
        ...(input.name !== undefined ? { name: normalizeString(input.name) } : {}),
        ...(input.notes !== undefined
          ? { notes: normalizeOptionalString(input.notes) }
          : {}),
        ...(input.phone !== undefined
          ? { phone: normalizeOptionalString(input.phone) }
          : {}),
        ...(input.segment !== undefined
          ? { segment: normalizeOptionalString(input.segment) }
          : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      },
    })
  }

  static async delete(businessId: string, customerId: string) {
    return prisma.customer.deleteMany({
      where: { id: customerId, businessId },
    })
  }

  static async getTransactionHistory(businessId: string, customerId: string) {
    return prisma.transaction.findMany({
      where: { businessId, customerId },
      orderBy: { soldAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    })
  }
}
