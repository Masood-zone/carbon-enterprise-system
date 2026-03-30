import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { apiErrorResponse } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeString } from "@/services/shared/validation.service"

type VerifyOtpBody = {
  email?: string
  otp?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyOtpBody
    const email = normalizeString(body.email).toLowerCase()
    const otp = normalizeString(body.otp)

    if (!email || !otp) {
      return apiErrorResponse("Email and OTP are required", 400)
    }

    const result = await auth.api.checkVerificationOTP({
      body: {
        email,
        otp,
        type: "forget-password",
      },
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return apiErrorResponse(getErrorMessage(error), 400)
  }
}
