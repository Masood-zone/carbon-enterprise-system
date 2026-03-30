import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { apiErrorResponse } from "@/services/shared/admin-guards"
import { getErrorMessage } from "@/services/shared/error.service"
import { normalizeString } from "@/services/shared/validation.service"

type RequestOtpBody = {
  email?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestOtpBody
    const email = normalizeString(body.email).toLowerCase()

    if (!email) {
      return apiErrorResponse("Email is required", 400)
    }

    const redirectTo = `${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`

    const result = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo,
      },
    })

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return apiErrorResponse(getErrorMessage(error), 400)
  }
}
