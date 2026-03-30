"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { ArrowLeft, ArrowRight } from "lucide-react"

import { getAxiosErrorMessage } from "@/services/api/axios"
import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
} from "@/services/auth/password-reset.service"

const STORAGE_EMAIL_KEY = "carbon.passwordReset.email"
const STORAGE_OTP_KEY = "carbon.passwordReset.otp"
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
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: 6 }, () => "")
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(
    RESEND_COOLDOWN_SECONDS
  )
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

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

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const otp = digits.join("")

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code.")
      return
    }

    try {
      setIsSubmitting(true)
      await verifyPasswordResetOtp({ email, otp })

      sessionStorage.setItem(STORAGE_OTP_KEY, otp)
      toast.success("Code verified. Create a new password.")
      router.push("/reset-password")
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email || cooldownSeconds > 0) {
      return
    }

    try {
      setIsResending(true)
      await requestPasswordResetOtp(email)

      setDigits(Array.from({ length: 6 }, () => ""))
      inputRefs.current[0]?.focus()
      setCooldownSeconds(RESEND_COOLDOWN_SECONDS)
      toast.success("A new verification code has been sent.")
    } catch (error) {
      toast.error(getAxiosErrorMessage(error))
    } finally {
      setIsResending(false)
    }
  }

  const handleDigitChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1)

    setDigits((prev) => {
      const next = [...prev]
      next[index] = nextValue
      return next
    })

    if (nextValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key !== "Backspace") return

    if (digits[index]) return
    if (index === 0) return

    inputRefs.current[index - 1]?.focus()
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
    if (!pasted) return

    event.preventDefault()

    const nextDigits = pasted.split("")
    setDigits((prev) => {
      const next = [...prev]
      for (let i = 0; i < 6; i += 1) {
        next[i] = nextDigits[i] ?? ""
      }
      return next
    })

    const focusIndex = Math.min(pasted.length, 6) - 1
    inputRefs.current[Math.max(0, focusIndex)]?.focus()
  }

  return (
    <div className="carbon-card p-8 md:p-10">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Verify identity
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to{" "}
          {masked || "your email"}.
        </p>
      </header>

      <form className="space-y-10" onSubmit={onSubmit}>
        <div>
          <label className="mb-5 block text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
            Verification Code
          </label>
          <div className="grid grid-cols-6 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={`otp-${index}`}
                ref={(element) => {
                  inputRefs.current[index] = element
                }}
                aria-label={`OTP digit ${index + 1}`}
                className="aspect-[1/1.2] border-b-2 border-border bg-background text-center text-2xl font-medium transition-colors outline-none placeholder:text-foreground focus:border-primary"
                inputMode="numeric"
                maxLength={1}
                placeholder="-"
                type="text"
                value={digits[index]}
                onChange={(event) =>
                  handleDigitChange(index, event.target.value)
                }
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={index === 0 ? handlePaste : undefined}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <button
            className="carbon-button-primary w-full justify-between px-6 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting || !email}
          >
            <span className="text-sm tracking-[0.28em] uppercase">
              {isSubmitting ? "Verifying..." : "Verify code"}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-6 text-[13px]">
            <span className="text-muted-foreground">
              Didn&apos;t receive the code?
            </span>
            <div className="flex items-center gap-3">
              <span className="bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {formatCooldown(cooldownSeconds)}
              </span>
              <button
                className="text-sm font-semibold text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
                disabled={Boolean(isResending || cooldownSeconds > 0 || !email)}
                type="button"
                onClick={handleResendOtp}
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            </div>
          </div>
        </div>
      </form>

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
