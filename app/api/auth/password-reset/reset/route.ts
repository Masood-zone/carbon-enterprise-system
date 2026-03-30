import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { apiErrorResponse } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeString } from "@/services/shared/validation.service"

type ResetPasswordBody = {
  email?: string
  otp?: string
  password?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordBody
    const email = normalizeString(body.email).toLowerCase()
    const otp = normalizeString(body.otp)
    const password = normalizeString(body.password)

    if (!email || !otp || !password) {
      return apiErrorResponse("Email, OTP, and password are required", 400)
    }

    const result = await auth.api.resetPasswordEmailOTP({
      body: {
        email,
        otp,
        password,
      },
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return apiErrorResponse(getErrorMessage(error), 400)
  }
}
