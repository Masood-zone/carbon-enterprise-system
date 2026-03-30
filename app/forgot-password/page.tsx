import Link from "next/link"

import { ShieldCheck } from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata = {
  title: "Forgot Password",
  description:
    "Start the password recovery process by providing your enterprise email address. We will guide you through the steps to securely reset your password.",
}

export default function ForgotPasswordPage() {
  return (
    <main className="carbon-page flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="carbon-section flex items-center justify-between gap-6 py-4">
          <CarbonBrand />
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#">
              Support
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Documentation
            </a>
          </div>
        </div>
      </header>

      <div className="grid flex-1 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-110">
            <nav className="flex items-center gap-4 text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
              <div className="flex items-center gap-2 text-primary">
                <span className="flex h-6 w-6 items-center justify-center border border-primary text-[10px]">
                  01
                </span>
                <span>Identify</span>
              </div>
              <div className="h-px w-8 bg-border" />
              <div className="flex items-center gap-2 opacity-40">
                <span className="flex h-6 w-6 items-center justify-center border border-border text-[10px]">
                  02
                </span>
                <span>Verify</span>
              </div>
              <div className="h-px w-8 bg-border" />
              <div className="flex items-center gap-2 opacity-40">
                <span className="flex h-6 w-6 items-center justify-center border border-border text-[10px]">
                  03
                </span>
                <span>Reset</span>
              </div>
            </nav>

            <div className="mt-8 space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                Forgot your password?
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                It happens to the best of us. Provide your enterprise email
                address and we&apos;ll help you get back into your account
                securely.
              </p>

              <div className="flex items-start gap-3 border-l-4 border-primary bg-muted p-4">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-[0.25em] text-foreground uppercase">
                    Security first
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">
                    We use multi-factor authentication to ensure your account
                    remains protected during this process.
                  </p>
                </div>
              </div>
            </div>

            <ForgotPasswordForm />

            <div className="mt-6">
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                href="/login"
              >
                Back to login
              </Link>
            </div>

            <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
              <p>
                Having trouble? Contact your IT administrator or visit our Help
                Center.
              </p>
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden border-l border-border bg-muted lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,98,254,0.06),transparent_45%),linear-gradient(225deg,rgba(0,0,0,0.03),transparent_35%)]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div className="h-48 border border-border bg-background/80 p-4 shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                <span>Enterprise infrastructure</span>
                <span>Protected</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="h-24 bg-muted" />
                <div className="h-24 bg-primary/10" />
                <div className="h-24 bg-muted" />
              </div>
            </div>

            <div className="max-w-sm">
              <p className="carbon-kicker text-primary">Security at scale</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                Control stays with the organization.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Carbon keeps access recovery clear, auditable, and predictable
                so your team can restore accounts without creating operational
                risk.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-border py-6">
        <div className="carbon-section flex flex-col gap-4 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="font-semibold tracking-[0.28em] text-foreground uppercase">
            Carbon Enterprise
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a className="transition-colors hover:text-foreground" href="#">
              Privacy Policy
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Terms of Service
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Security
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
