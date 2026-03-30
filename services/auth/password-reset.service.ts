import { api } from "@/services/api/axios"
import { normalizeString } from "@/services/shared/validation.service"

export type PasswordResetRequestResponse = {
  ok: true
  status?: boolean
  message?: string
}

export type PasswordResetResponse = {
  ok: true
  status?: boolean
}

export async function requestPasswordReset(email: string) {
  const resolvedEmail = normalizeString(email).toLowerCase()

  const response = await api.post<PasswordResetRequestResponse>(
    "/api/auth/password-reset/request-otp",
    {
      email: resolvedEmail,
    }
  )

  return response.data
}

export async function resetPasswordWithToken(args: {
  token: string
  password: string
}) {
  const token = normalizeString(args.token)

  const response = await api.post<PasswordResetResponse>(
    "/api/auth/password-reset/reset",
    {
      token,
      newPassword: args.password,
    }
  )

  return response.data
}

export const requestPasswordResetOtp = requestPasswordReset
export async function verifyPasswordResetOtp(_: {
  email: string
  otp: string
}) {
  throw new Error("OTP verification is no longer used for password reset")
}
export const resetPasswordWithOtp = resetPasswordWithToken
