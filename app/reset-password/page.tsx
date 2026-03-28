import Link from "next/link"

import { ArrowLeft, ArrowRight, Check, Circle, Eye } from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"

export const metadata = {
  title: "Reset Password",
}

const requirements = [
  { label: "Minimum 12 characters", met: true },
  { label: "Case sensitivity (A, a)", met: true },
  { label: "At least one symbol (!@#$%^&*)", met: false },
]

export default function ResetPasswordPage() {
  return (
    <main className="carbon-page flex min-h-svh flex-col">
      <header className="border-b border-border bg-background">
        <div className="carbon-section flex items-center justify-between gap-6 py-4">
          <CarbonBrand />
          <div className="text-[13px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
            Step 3 of 3
          </div>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-light tracking-tight text-foreground">
              Create new password
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Ensure your account stays secure by choosing a password that meets
              our enterprise standards.
            </p>
          </div>

          <form className="space-y-8">
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
                  type="password"
                />
                <button
                  aria-label="Show password"
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  type="button"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

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
                  type="password"
                />
                <div className="absolute top-1/2 right-4 -translate-y-1/2 text-green-700">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="border border-border bg-muted p-5">
              <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Security requirements
              </p>
              <ul className="space-y-3">
                {requirements.map((requirement) => (
                  <li
                    key={requirement.label}
                    className="flex items-start gap-3"
                  >
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
              className="carbon-button-primary w-full justify-between px-6"
              type="submit"
            >
              <span className="text-sm tracking-[0.28em] uppercase">
                Update password
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-10 border-t border-border pt-8 text-center">
            <Link
              className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[0.22em] text-primary uppercase hover:underline"
              href="/verify-otp"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Return to sign in
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8">
        <div className="carbon-section flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <div>© 2024 Carbon Enterprise Systems.</div>
          <div className="flex gap-8">
            <a className="transition-colors hover:text-foreground" href="#">
              Privacy Policy
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Legal Terms
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
