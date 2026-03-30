"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ArrowRight, Eye, EyeOff } from "lucide-react"

import { userLogin } from "@/services/auth/user-auth"

type LoginFormValues = {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>()

  const onSubmit = async (values: LoginFormValues) => {
    const result = await userLogin({
      email: values.email,
      password: values.password,
      rememberMe: true,
    })

    if (result?.error) {
      toast.error(
        result.error.message || "Unable to sign in. Check your credentials."
      )
      return
    }

    toast.success("Signed in successfully")
    router.push("/")
    router.refresh()
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label
          className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase"
          htmlFor="email"
        >
          User ID
        </label>
        <input
          className="carbon-input"
          id="email"
          placeholder="name@company.com"
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

      <div className="space-y-2">
        <div className="flex items-end justify-between gap-4">
          <label
            className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase"
            htmlFor="password"
          >
            Password
          </label>
        </div>
        <div className="relative">
          <input
            className="carbon-input pr-12"
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
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
          <Link
            className="text-xs font-medium text-primary hover:underline"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <button
        className="carbon-button-primary w-full cursor-pointer justify-between px-4 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? "Signing in..." : "Continue to workspace"}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}
