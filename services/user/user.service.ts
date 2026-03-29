import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { normalizeString } from "@/services/shared/validation.service"

export type UserRole = "ADMIN" | "MANAGER"

export type UserCreateInput = {
  email: string
  name: string
  password: string
  role?: UserRole
}

export type UserUpdateInput = {
  email?: string
  name?: string
  role?: UserRole
}

export class UserService {
  static async listByBusiness(businessId: string) {
    return prisma.user.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
        createdAt: true,
        updatedAt: true,
        lastActiveAt: true,
        emailVerified: true,
        image: true,
      },
    })
  }

  static async getById(businessId: string, userId: string) {
    return prisma.user.findFirst({
      where: { id: userId, businessId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
        createdAt: true,
        updatedAt: true,
        lastActiveAt: true,
        emailVerified: true,
        image: true,
        accounts: true,
      },
    })
  }

  static async createManager(businessId: string, input: UserCreateInput) {
    const email = normalizeString(input.email).toLowerCase()
    const name = normalizeString(input.name)
    const role = input.role ?? "MANAGER"

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        name,
        password: input.password,
      },
    })

    if (!signUpResult?.user?.id) {
      throw new Error("Unable to create the user account")
    }

    return prisma.user.update({
      where: { id: signUpResult.user.id },
      data: {
        businessId,
        email,
        name,
        role,
        lastActiveAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
        createdAt: true,
        updatedAt: true,
        lastActiveAt: true,
        emailVerified: true,
      },
    })
  }

  static async updateUser(
    businessId: string,
    userId: string,
    input: UserUpdateInput
  ) {
    return prisma.user.updateMany({
      where: { id: userId, businessId },
      data: {
        ...(input.email !== undefined
          ? { email: normalizeString(input.email).toLowerCase() }
          : {}),
        ...(input.name !== undefined
          ? { name: normalizeString(input.name) }
          : {}),
        ...(input.role !== undefined ? { role: input.role } : {}),
      },
    })
  }

  static async deleteUser(businessId: string, userId: string) {
    return prisma.user.deleteMany({
      where: { id: userId, businessId },
    })
  }

  static async getBusinessUserCount(businessId: string) {
    return prisma.user.count({ where: { businessId } })
  }

  static async getCurrentUser(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }
}
