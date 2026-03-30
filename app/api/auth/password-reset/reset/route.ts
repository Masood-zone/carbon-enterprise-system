import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { apiErrorResponse } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"

type ResetPasswordBody = {
  token?: string
  password?: string
  newPassword?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordBody
    const token = typeof body.token === "string" ? body.token.trim() : ""
    const password =
      typeof body.newPassword === "string"
        ? body.newPassword
        : typeof body.password === "string"
          ? body.password
          : ""

    if (!token || !password) {
      return apiErrorResponse("Token and password are required", 400)
    }

    const result = await auth.api.resetPassword({
      body: {
        token,
        newPassword: password,
      },
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return apiErrorResponse(getErrorMessage(error), 400)
  }
}
