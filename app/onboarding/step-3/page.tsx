import Link from "next/link"

import { ChevronLeft, UserPlus, Trash2 } from "lucide-react"

import { OnboardingTopBar } from "@/components/onboarding/onboarding-ui"

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
    <main className="carbon-page flex min-h-svh flex-col bg-muted/30">
      <OnboardingTopBar
        className="fixed top-0 left-0 z-50 w-full"
        compactBrandOnMobile
        rightSlot={
          <span className="text-xs font-medium tracking-[0.32em] text-muted-foreground uppercase">
            Onboarding Protocol
          </span>
        }
      />

      <div className="flex flex-1 justify-center px-4 py-16 pt-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="carbon-card overflow-hidden bg-background shadow-sm">
            <div className="h-1 w-3/4 bg-primary" />

            <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
              <p className="carbon-kicker text-muted-foreground">Step 3 of 4</p>
              <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                Add Initial Team
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Setup your administrative structure.
              </p>

              <div className="mt-8 space-y-8">
                <div className="border border-border bg-muted p-6 sm:p-8">
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
                        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 -rotate-90 text-muted-foreground"
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

                <section className="border border-border bg-background p-6 sm:p-8">
                  <p className="carbon-kicker text-muted-foreground">
                    Registered Managers (2)
                  </p>
                  <div className="mt-4 space-y-4">
                    {managers.map((manager) => (
                      <article
                        key={manager.name}
                        className="flex items-center justify-between gap-4 border border-border bg-muted p-4"
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
              </div>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <Link
                className="carbon-button-secondary"
                href="/onboarding/step-2"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Link>
              <Link
                className="carbon-button-primary w-full sm:w-auto"
                href="/onboarding/step-4"
              >
                Continue to Final Step
                <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 border border-border bg-muted p-4 text-xs leading-6 text-muted-foreground">
            Managers added during onboarding will receive an activation email
            once the setup is complete. You can modify permissions and add
            additional team members from the Dashboard after launch.
          </div>
        </div>
      </div>
    </main>
  )
}
