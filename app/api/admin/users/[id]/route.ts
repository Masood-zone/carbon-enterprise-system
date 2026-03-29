import { NextResponse } from "next/server"

import { UserService } from "@/services/user/user.service"
import { apiErrorResponse, withAdmin } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeOptionalString } from "@/services/shared/validation.service"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async ({ businessId }) => {
    const { id } = await context.params
    const user = await UserService.getById(businessId, id)

    if (!user) {
      return apiErrorResponse("User not found", 404)
    }

    return NextResponse.json({ ok: true, user })
  })
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async ({ businessId, session }) => {
    try {
      const { id } = await context.params
      const body = (await request.json()) as Record<string, unknown>

      if (session.user.id === id) {
        return apiErrorResponse(
          "You cannot update your own admin account here",
          400
        )
      }

      const result = await UserService.updateUser(businessId, id, {
        email: normalizeOptionalString(body.email),
        name: normalizeOptionalString(body.name),
        role:
          body.role === "ADMIN"
            ? "ADMIN"
            : body.role === "MANAGER"
              ? "MANAGER"
              : undefined,
      })

      if (!result.count) {
        return apiErrorResponse("User not found", 404)
      }

      const user = await UserService.getById(businessId, id)

      return NextResponse.json({ ok: true, user })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return withAdmin(request, async ({ businessId, session }) => {
    try {
      const { id } = await context.params

      if (session.user.id === id) {
        return apiErrorResponse("You cannot delete your own admin account", 400)
      }

      const result = await UserService.deleteUser(businessId, id)

      if (!result.count) {
        return apiErrorResponse("User not found", 404)
      }

      return NextResponse.json({ ok: true, deleted: true })
    } catch (error) {
      return apiErrorResponse(getErrorMessage(error), 400)
    }
  })
}
