import { NextResponse } from "next/server"

import { auth, isAdmin } from "@/lib/auth"

type AuthSession = NonNullable<
  Awaited<ReturnType<(typeof auth.api)["getSession"]>>
>

type AdminSessionUser = AuthSession["user"] & {
  businessId?: string | null
}

export type AdminSession = Omit<AuthSession, "user"> & {
  user: AdminSessionUser
}

export type AdminAccessLevel = "ADMIN" | "MANAGER"

export type AdminRequestContext = {
  businessId: string
  request: Request
  session: AdminSession
}

function getUserBusinessId(session: AdminSession) {
  const businessId = session.user.businessId?.trim()

  if (!businessId) {
    return null
  }

  return businessId
}

export function apiErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function getAdminSession(request: Request) {
  return auth.api.getSession({ headers: request.headers })
}

export async function withAdmin<T>(
  request: Request,
  handler: (context: AdminRequestContext) => Promise<T>
) {
  const session = await getAdminSession(request)

  if (!session) {
    return apiErrorResponse("Authentication required", 401)
  }

  if (!isAdmin(session.user)) {
    return apiErrorResponse("Admin access required", 403)
  }

  const businessId = getUserBusinessId(session)

  if (!businessId) {
    return apiErrorResponse("Business access is required", 403)
  }

  return handler({ request, session, businessId })
}

export async function withManager<T>(
  request: Request,
  handler: (context: AdminRequestContext) => Promise<T>
) {
  const session = await getAdminSession(request)

  if (!session) {
    return apiErrorResponse("Authentication required", 401)
  }

  const role = session.user.role?.toUpperCase()

  if (role !== "ADMIN" && role !== "MANAGER") {
    return apiErrorResponse("Manager access required", 403)
  }

  const businessId = getUserBusinessId(session)

  if (!businessId) {
    return apiErrorResponse("Business access is required", 403)
  }

  return handler({ request, session, businessId })
}
