"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { ArrowLeft } from "lucide-react"

import { getAxiosErrorMessage } from "@/services/api/axios"
import { requestPasswordReset } from "@/services/auth/password-reset.service"

const STORAGE_EMAIL_KEY = "carbon.passwordReset.email"
const RESEND_COOLDOWN_SECONDS = 24

function maskEmail(email: string) {
  const trimmed = email.trim()
  const [user, domain] = trimmed.split("@")
  if (!user || !domain) return trimmed

  const prefix = user.slice(0, 2)
  const hidden = "*".repeat(Math.max(3, user.length - prefix.length))
  return `${prefix}${hidden}@${domain}`
}

export function VerifyOtpCard() {
  const router = useRouter()
  const [email, setEmail] = useState<string>("")
  const [isResending, setIsResending] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(
    RESEND_COOLDOWN_SECONDS
  )

  useEffect(() => {
    const storedEmail = sessionStorage.getItem(STORAGE_EMAIL_KEY)

    if (!storedEmail?.trim()) {
      router.replace("/forgot-password")
      return
    }

    setEmail(storedEmail)
  }, [router])

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCooldownSeconds((current) => Math.max(current - 1, 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [cooldownSeconds])

  const masked = useMemo(() => (email ? maskEmail(email) : ""), [email])

  const formatCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
  }

  const handleResendEmail = async () => {
    if (!email || cooldownSeconds > 0) {
      return
    }

    try {
      setIsResending(true)
      await requestPasswordReset(email)
      setCooldownSeconds(RESEND_COOLDOWN_SECONDS)
      toast.success("A new password reset email has been sent.")
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="carbon-card p-8 md:p-10">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Check your inbox
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          We&apos;ve sent a password reset email to {masked || "your email"}.
        </p>
      </header>

      <div className="space-y-10">
        <div className="space-y-6 border-t border-border pt-6 text-[13px]">
          <p className="text-muted-foreground">
            Open the email and click the reset link to choose a new password.
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Didn&apos;t receive the email?
            </span>
            <div className="flex items-center gap-3">
              <span className="bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {formatCooldown(cooldownSeconds)}
              </span>
              <button
                className="text-sm font-semibold text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
                disabled={Boolean(isResending || cooldownSeconds > 0 || !email)}
                type="button"
                onClick={handleResendEmail}
              >
                {isResending ? "Sending..." : "Resend email"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          href="/forgot-password"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
