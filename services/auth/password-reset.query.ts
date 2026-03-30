import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { getAxiosErrorMessage } from "@/services/api/axios"

import {
  requestPasswordReset,
  resetPasswordWithToken,
} from "./password-reset.service"

export function useRequestPasswordResetMutation() {
  return useMutation({
    mutationFn: async (email: string) => requestPasswordReset(email),
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: async (args: { token: string; password: string }) =>
      resetPasswordWithToken(args),
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error))
    },
  })
}

export const useRequestPasswordResetOtpMutation =
  useRequestPasswordResetMutation
export const useVerifyPasswordResetOtpMutation = useResetPasswordMutation
export const useResetPasswordWithOtpMutation = useResetPasswordMutation
