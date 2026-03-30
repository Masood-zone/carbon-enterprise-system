import { api } from "@/services/api/axios"
import { normalizeString } from "@/services/shared/validation.service"

export type PasswordResetRequestOtpResponse = {
  ok: true
  success?: boolean
}

export type PasswordResetVerifyOtpResponse = {
  ok: true
  valid?: boolean
}

export type PasswordResetResponse = {
  ok: true
  success?: boolean
}

export async function requestPasswordResetOtp(email: string) {
  const resolvedEmail = normalizeString(email).toLowerCase()

  const response = await api.post<PasswordResetRequestOtpResponse>(
    "/api/auth/password-reset/request-otp",
    {
      email: resolvedEmail,
    }
  )

  return response.data
}

export async function verifyPasswordResetOtp(args: {
  email: string
  otp: string
}) {
  const email = normalizeString(args.email).toLowerCase()
  const otp = normalizeString(args.otp)

  const response = await api.post<PasswordResetVerifyOtpResponse>(
    "/api/auth/password-reset/verify-otp",
    {
      email,
      otp,
    }
  )

  return response.data
}

export async function resetPasswordWithOtp(args: {
  email: string
  otp: string
  password: string
}) {
  const email = normalizeString(args.email).toLowerCase()
  const otp = normalizeString(args.otp)
  const password = normalizeString(args.password)

  const response = await api.post<PasswordResetResponse>(
    "/api/auth/password-reset/reset",
    {
      email,
      otp,
      password,
    }
  )

  return response.data
}
