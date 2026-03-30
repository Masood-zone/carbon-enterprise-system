import { Suspense } from "react"

import { CarbonBrand } from "@/components/carbon-brand"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata = {
  title: "Reset Password",
  description:
    "Create a new password for your account. Make sure to choose a strong and unique password to keep your account secure.",
}

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
          <Suspense
            fallback={
              <div className="space-y-8">
                <div className="h-24 animate-pulse border border-border bg-muted" />
                <div className="h-24 animate-pulse border border-border bg-muted" />
                <div className="h-16 animate-pulse border border-border bg-muted" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
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
