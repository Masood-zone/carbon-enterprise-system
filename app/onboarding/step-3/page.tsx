import Link from "next/link"

import { ChevronLeft, UserPlus, Trash2 } from "lucide-react"

import {
  OnboardingProgressBar,
  OnboardingTopBar,
} from "@/components/onboarding/onboarding-ui"

export const metadata = {
  title: "Onboarding Step 3",
}

const managers = [
  {
    initials: "AO",
    name: "Abena Osei",
    email: "abena.osei@enterprise.gh",
    role: "Operations Lead",
    accent: "bg-slate-200 text-slate-800",
  },
  {
    initials: "KB",
    name: "Kofi Boateng",
    email: "k.boateng@enterprise.gh",
    role: "Regional Manager",
    accent: "bg-blue-100 text-blue-900",
  },
]

export default function OnboardingStepThreePage() {
  return (
    <main className="carbon-page flex min-h-svh flex-col bg-background">
      <OnboardingTopBar
        className="fixed top-0 left-0 z-50 w-full"
        rightSlot={
          <span className="text-xs font-medium tracking-[0.32em] text-muted-foreground uppercase">
            Onboarding Protocol
          </span>
        }
      />

      <div className="flex flex-1 items-center justify-center px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="mb-10">
            <OnboardingProgressBar
              description="Setup your administrative structure"
              percentLabel="75% Complete"
              progressWidthClass="w-3/4"
              stepLabel="Step 3 of 4"
              title="Add Initial Team"
            />
          </div>

          <div className="carbon-card bg-muted p-6 sm:p-8">
            <p className="carbon-kicker text-muted-foreground">
              Add new manager
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-muted-foreground"
                  htmlFor="full-name"
                >
                  Full Name
                </label>
                <input
                  className="carbon-input"
                  id="full-name"
                  name="full-name"
                  placeholder="e.g. Kwame Mensah"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-xs font-medium text-muted-foreground"
                  htmlFor="work-email"
                >
                  Work Email
                </label>
                <input
                  className="carbon-input"
                  id="work-email"
                  name="work-email"
                  placeholder="kwame@company.com"
                  type="email"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <label
                className="text-xs font-medium text-muted-foreground"
                htmlFor="role"
              >
                Administrative Role
              </label>
              <div className="relative">
                <input
                  className="carbon-input pr-10"
                  id="role"
                  name="role"
                  defaultValue="Regional Manager"
                  type="text"
                />
                <ChevronLeft
                  className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-[-90deg] text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="carbon-button-primary" type="button">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Add Member
              </button>
            </div>
          </div>

          <section className="mt-10">
            <p className="carbon-kicker text-muted-foreground">
              Registered Managers (2)
            </p>
            <div className="mt-4 space-y-4">
              {managers.map((manager) => (
                <article
                  key={manager.name}
                  className="carbon-card flex items-center justify-between gap-4 bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center text-xs font-semibold ${manager.accent}`}
                    >
                      {manager.initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {manager.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {manager.email} • {manager.role}
                      </p>
                    </div>
                  </div>
                  <button
                    aria-label={`Remove ${manager.name}`}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-10 border-t border-border pt-6">
            <div className="flex items-center justify-between gap-4">
              <Link
                className="carbon-button-secondary"
                href="/onboarding/step-2"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Link>
              <Link className="carbon-button-primary" href="/onboarding/step-4">
                Continue to Final Step
                <span className="text-base leading-none">→</span>
              </Link>
            </div>

            <div className="mt-6 border border-border bg-muted p-4 text-xs leading-6 text-muted-foreground">
              Managers added during onboarding will receive an activation email
              once the setup is complete. You can modify permissions and add
              additional team members from the Dashboard after launch.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
