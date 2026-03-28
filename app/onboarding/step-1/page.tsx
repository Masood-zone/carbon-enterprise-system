import Link from "next/link"

import {
  BarChart3,
  ChevronDown,
  CircleHelp,
  Lock,
  MapPinned,
  UserCircle2,
} from "lucide-react"

import { OnboardingTopBar } from "@/components/onboarding/onboarding-ui"

export const metadata = {
  title: "Onboarding Step 1",
}

export default function OnboardingStepOnePage() {
  return (
    <main className="carbon-page flex min-h-svh flex-col bg-muted/30">
      <OnboardingTopBar
        className="fixed top-0 left-0 z-50 w-full"
        rightSlot={
          <>
            <button
              aria-label="Help"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              type="button"
            >
              <CircleHelp className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="h-6 w-px bg-border" />
            <button
              aria-label="Account"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              type="button"
            >
              <UserCircle2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        }
      />

      <div className="flex flex-1 justify-center px-4 py-16 pt-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="carbon-card overflow-hidden bg-background shadow-sm">
            <div className="h-1 w-1/4 bg-primary" />

            <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
              <p className="carbon-kicker text-muted-foreground">Step 1 of 4</p>
              <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Business Profile
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Tell us about your company to tailor your analytics dashboard.
              </p>

              <form className="mt-8 space-y-6">
                <div className="space-y-2">
                  <label
                    className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                    htmlFor="business-name"
                  >
                    Business Name
                  </label>
                  <input
                    className="carbon-input"
                    id="business-name"
                    name="business-name"
                    placeholder="e.g. Accra Digital Ventures"
                    type="text"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                      htmlFor="industry"
                    >
                      Industry Type
                    </label>
                    <div className="relative">
                      <input
                        className="carbon-input pr-10"
                        id="industry"
                        name="industry"
                        placeholder="Select industry"
                        type="text"
                      />
                      <ChevronDown
                        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                      htmlFor="location"
                    >
                      Location
                    </label>
                    <div className="relative">
                      <input
                        className="carbon-input pr-10"
                        id="location"
                        name="location"
                        placeholder="Select region"
                        type="text"
                      />
                      <MapPinned
                        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase">
                    Base Currency
                  </label>
                  <div className="flex h-12 items-center justify-between border border-border bg-muted px-4 text-sm text-foreground">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-5 w-5 items-center justify-center border border-border bg-white text-xs">
                        GH
                      </span>
                      <span>GHS — Ghanaian Cedi</span>
                    </div>
                    <Lock
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reporting currency is locked to your primary region.
                  </p>
                </div>
              </form>
            </div>

            <div className="grid gap-0 border-b border-border lg:grid-cols-[2fr_1fr]">
              <div className="bg-primary/10 p-6 sm:p-8">
                <p className="carbon-kicker text-primary">Analytics ready</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  Connecting local insights.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  Establish the operational profile that powers reporting,
                  inventory visibility, and business context.
                </p>
                <div className="mt-6 flex items-center gap-3 text-xs font-semibold tracking-[0.25em] text-primary uppercase">
                  <BarChart3 className="h-4 w-4" aria-hidden="true" />
                  Analytics ready
                </div>
              </div>
              <div className="flex items-center justify-center bg-[#a7f0ba] p-8">
                <div className="flex h-14 w-14 items-center justify-center bg-foreground text-background">
                  <BarChart3 className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <Link
                className="text-sm font-medium text-primary transition-colors hover:underline"
                href="/onboarding/step-2"
              >
                Skip for now
              </Link>
              <Link
                className="carbon-button-primary w-full sm:w-auto"
                href="/onboarding/step-2"
              >
                Continue
                <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Need assistance setting up?{" "}
            <a className="text-primary hover:underline" href="#">
              Contact Enterprise Support
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
