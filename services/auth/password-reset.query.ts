import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { getAxiosErrorMessage } from "@/services/api/axios"

import {
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  verifyPasswordResetOtp,
} from "./password-reset.service"

export function useRequestPasswordResetOtpMutation() {
  return useMutation({
    mutationFn: async (email: string) => requestPasswordResetOtp(email),
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useVerifyPasswordResetOtpMutation() {
  return useMutation({
    mutationFn: async (args: { email: string; otp: string }) =>
      verifyPasswordResetOtp(args),
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useResetPasswordWithOtpMutation() {
  return useMutation({
    mutationFn: async (args: {
      email: string
      otp: string
      password: string
    }) => resetPasswordWithOtp(args),
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}
