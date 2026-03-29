import { NextResponse } from "next/server"

import { UserService } from "@/services/user/user.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeString } from "@/services/shared/validation.service"

export async function GET(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    const users = await UserService.listByBusiness(businessId)
    return NextResponse.json({ ok: true, users })
  })
}

export async function POST(request: Request) {
  return withAdmin(request, async ({ businessId }) => {
    try {
      const body = (await request.json()) as Record<string, unknown>

      const email = normalizeString(body.email).toLowerCase()
      const name = normalizeString(body.name)
      const password = normalizeString(body.password)
      const role = body.role === "ADMIN" ? "ADMIN" : "MANAGER"

      if (!email || !name || !password) {
        return apiErrorResponse("Name, email, and password are required", 400)
      }

      const user = await UserService.createManager(businessId, {
        email,
        name,
        password,
        role,
      })

      return NextResponse.json({ ok: true, user }, { status: 201 })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
