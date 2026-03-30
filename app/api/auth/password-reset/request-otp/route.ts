import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { emailService, getAppName, getAppUrl } from "@/lib/email-service"
import { buildOtpEmail } from "@/lib/otp-emails"
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

    const result = await auth.api.requestPasswordResetEmailOTP({
      body: { email },
    })

    const verification = await auth.api.getVerificationOTP({
      query: {
        email,
        type: "forget-password",
      },
    })

    if (verification?.otp) {
      const message = buildOtpEmail({
        appName: getAppName(),
        appUrl: getAppUrl(),
        email,
        otp: verification.otp,
        type: "forget-password",
        expiresInMinutes: 15,
      })

      await emailService.sendEmail({
        to: email,
        subject: message.subject,
        html: message.html,
        text: message.text,
      })
    }

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    return apiErrorResponse(getErrorMessage(error), 400)
  }
}
