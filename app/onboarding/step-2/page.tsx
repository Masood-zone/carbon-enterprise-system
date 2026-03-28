import Link from "next/link"

import { ChevronDown, ChevronLeft } from "lucide-react"

import { OnboardingTopBar } from "@/components/onboarding/onboarding-ui"

export const metadata = {
  title: "Onboarding Step 2",
}

export default function OnboardingStepTwoPage() {
  return (
    <main className="carbon-page flex min-h-svh flex-col bg-muted/30">
      <OnboardingTopBar
        className="fixed top-0 left-0 z-50 w-full"
        compactBrandOnMobile
      />

      <div className="flex flex-1 justify-center px-4 py-16 pt-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="carbon-card overflow-hidden bg-background shadow-sm">
            <div className="h-1 w-1/2 bg-primary" />

            <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
              <p className="carbon-kicker text-muted-foreground">Step 2 of 4</p>
              <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Financial Setup
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                All accounting entries will be recorded in this currency by
                default.
              </p>

              <div className="mt-8 space-y-8">
                <div className="space-y-2">
                  <label
                    className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                    htmlFor="currency"
                  >
                    Base Currency
                  </label>
                  <div className="flex h-12 items-center justify-between border border-border bg-muted px-4 text-sm text-foreground">
                    <span>GHS - Ghanaian Cedi</span>
                    <ChevronDown
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All accounting entries will be recorded in this currency by
                    default.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                    htmlFor="tin"
                  >
                    Tax Identification Number (TIN)
                  </label>
                  <input
                    className="carbon-input"
                    id="tin"
                    name="tin"
                    placeholder="P00XXXXXXXX"
                    type="text"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your 11-digit GRA registered Tax Identification
                    Number.
                  </p>
                </div>

                <div className="border-l-4 border-primary bg-muted p-5">
                  <label
                    className="flex items-start gap-3 text-sm text-foreground"
                    htmlFor="vat-status"
                  >
                    <input
                      className="mt-1 h-4 w-4 rounded-none border-border text-primary focus:ring-0"
                      id="vat-status"
                      type="checkbox"
                      defaultChecked
                    />
                    <span>
                      <span className="block font-medium">
                        VAT Registration Status
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                        Check this if your business is registered for Value
                        Added Tax with the Ghana Revenue Authority.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
              <p className="carbon-kicker text-muted-foreground">
                Statutory Levies Configuration
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      NHIL / GETFund / COVID-19 Levy
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Apply current standard rates (2.5% + 2.5% + 1%) to sales
                    </p>
                  </div>
                  <button
                    aria-pressed="true"
                    aria-label="NHIL / GETFund / COVID-19 Levy enabled"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
                    title="NHIL / GETFund / COVID-19 Levy enabled"
                    type="button"
                  >
                    <span className="sr-only">Enabled</span>
                    <span className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-background" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      E-Levy Automation
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Calculate electronic transfer levies on digital payments
                    </p>
                  </div>
                  <button
                    aria-pressed="false"
                    aria-label="E-Levy Automation disabled"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-border"
                    title="E-Levy Automation disabled"
                    type="button"
                  >
                    <span className="sr-only">Disabled</span>
                    <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <Link
                className="carbon-button-secondary"
                href="/onboarding/step-1"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Link>
              <Link
                className="carbon-button-primary w-full sm:w-auto"
                href="/onboarding/step-3"
              >
                Continue
                <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </div>

          <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <div className="flex gap-6">
              <a className="transition-colors hover:text-foreground" href="#">
                Help Center
              </a>
              <a className="transition-colors hover:text-foreground" href="#">
                Privacy Policy
              </a>
            </div>
            <div>© 2024 Ghana Business Hub</div>
          </footer>
        </div>
      </div>
    </main>
  )
}
