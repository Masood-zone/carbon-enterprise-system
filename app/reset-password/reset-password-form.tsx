"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ArrowLeft, ArrowRight, Check, Circle, Eye, EyeOff } from "lucide-react"

import { getAxiosErrorMessage } from "@/services/api/axios"
import { resetPasswordWithToken } from "@/services/auth/password-reset.service"

type ResetPasswordFormValues = {
  password: string
  confirmPassword: string
}

const requirements = [
  { label: "Minimum 12 characters", met: true },
  { label: "Case sensitivity (A, a)", met: true },
  { label: "At least one symbol (!@#$%^&*)", met: false },
]

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>()

  const token = searchParams.get("token")?.trim() ?? ""

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password")
    }
  }, [router, token])

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (!token) {
      toast.error("Missing reset token")
      return
    }

    try {
      await resetPasswordWithToken({
        token,
        password: values.password,
      })

      toast.success("Password updated. You can sign in now.")
      router.push("/login")
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    }
  }

  return (
    <>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div className="flex items-end justify-between gap-4">
            <label
              className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase"
              htmlFor="new-password"
            >
              New Password
            </label>
          </div>
          <div className="relative">
            <input
              className="carbon-input pr-12"
              id="new-password"
              placeholder=" "
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password is too short" },
              })}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          ) : null}

          <div className="pt-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Password strength
              </span>
              <span className="text-[11px] font-bold tracking-[0.2em] text-green-700 uppercase">
                Strong
              </span>
            </div>
            <div className="flex h-1 gap-1">
              <div className="flex-1 bg-green-600" />
              <div className="flex-1 bg-green-600" />
              <div className="flex-1 bg-green-600" />
              <div className="flex-1 bg-border" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              className="carbon-input pr-12"
              id="confirm-password"
              placeholder=" "
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
              })}
            />
            <button
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="text-xs font-medium text-destructive">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <div className="border border-border bg-muted p-5">
          <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Security requirements
          </p>
          <ul className="space-y-3">
            {requirements.map((requirement) => (
              <li key={requirement.label} className="flex items-start gap-3">
                {requirement.met ? (
                  <Check
                    className="mt-0.5 h-4 w-4 text-green-700"
                    aria-hidden="true"
                  />
                ) : (
                  <Circle
                    className="mt-0.5 h-4 w-4 text-border"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-[13px] ${requirement.met ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {requirement.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="carbon-button-primary w-full justify-between px-6 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting || !token}
        >
          <span className="text-sm tracking-[0.28em] uppercase">
            {isSubmitting ? "Updating..." : "Update password"}
          </span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      <div className="mt-10 border-t border-border pt-8 text-center">
        <Link
          className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.22em] text-primary uppercase hover:underline"
          href="/login"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Return to sign in
        </Link>
      </div>
    </>
  )
}
