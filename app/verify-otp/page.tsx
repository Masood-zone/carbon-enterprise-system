import Link from "next/link"

import { ArrowLeft, ArrowRight } from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"

export const metadata = {
  title: "Verify OTP",
}

export default function VerifyOtpPage() {
  return (
    <main className="carbon-page flex min-h-svh flex-col">
      <div className="flex-1 px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-[440px] flex-col items-stretch">
          <div className="mb-12">
            <CarbonBrand className="items-start" />
            <div className="mt-4 h-1 w-10 bg-primary" />
          </div>

          <div className="carbon-card p-8 md:p-10">
            <header className="mb-10 space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Verify identity
              </h1>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                We&apos;ve sent a 6-digit verification code to
                al***@example.com.
              </p>
            </header>

            <form className="space-y-10">
              <div>
                <label className="mb-5 block text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                  Verification Code
                </label>
                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <input
                      key={`otp-${index}`}
                      aria-label={`OTP digit ${index + 1}`}
                      className="aspect-[1/1.2] border-b-2 border-border bg-background text-center text-2xl font-medium transition-colors outline-none placeholder:text-foreground focus:border-primary"
                      inputMode="numeric"
                      maxLength={1}
                      placeholder="-"
                      type="text"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <button
                  className="carbon-button-primary w-full justify-between px-6"
                  type="submit"
                >
                  <span className="text-sm tracking-[0.28em] uppercase">
                    Verify code
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <div className="flex items-center justify-between gap-4 border-t border-border pt-6 text-[13px]">
                  <span className="text-muted-foreground">
                    Didn&apos;t receive the code?
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                      00:24
                    </span>
                    <button
                      className="text-sm font-semibold text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground"
                      disabled
                      type="button"
                    >
                      Resend
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

          <p className="mx-auto mt-8 max-w-sm text-center text-[13px] leading-relaxed text-muted-foreground">
            Trouble receiving the code? Check your spam folder or contact system
            support.
          </p>
        </div>
      </div>

      <footer className="border-t border-border py-8">
        <div className="carbon-section flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <div className="font-semibold tracking-[0.28em] text-foreground uppercase">
            Carbon Enterprise
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <a className="transition-colors hover:text-foreground" href="#">
              Privacy Policy
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Terms of Service
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Security Guidelines
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
