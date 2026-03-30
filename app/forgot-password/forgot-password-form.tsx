"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ArrowRight } from "lucide-react"

import { getAxiosErrorMessage } from "@/services/api/axios"
import { requestPasswordResetOtp } from "@/services/auth/password-reset.service"

type ForgotPasswordFormValues = {
  email: string
}

const STORAGE_EMAIL_KEY = "carbon.passwordReset.email"

export function ForgotPasswordForm() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>()

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await requestPasswordResetOtp(values.email)

      sessionStorage.setItem(
        STORAGE_EMAIL_KEY,
        values.email.trim().toLowerCase()
      )
      sessionStorage.removeItem("carbon.passwordReset.otp")

      toast.success("We’ve sent a 6-digit code.")
      router.push("/verify-otp")
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    }
  }

  return (
    <form className="mt-10 space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label
          className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
          htmlFor="enterprise-email"
        >
          Enterprise Email
        </label>
        <input
          className="carbon-input"
          id="enterprise-email"
          placeholder="e.g. j.doe@carbon-enterprise.com"
          type="email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
          })}
        />
        {errors.email ? (
          <p className="text-xs font-medium text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-4">
        <button
          className="carbon-button-primary w-full justify-between px-6 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? "Requesting..." : "Request OTP"}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
