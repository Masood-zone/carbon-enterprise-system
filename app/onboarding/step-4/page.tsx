import Link from "next/link"

import {
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Rocket,
  Settings,
  UserCircle2,
} from "lucide-react"

import {
  OnboardingStepper,
  OnboardingTopBar,
} from "@/components/onboarding/onboarding-ui"

export const metadata = {
  title: "Onboarding Step 4",
}

const teamMembers = [
  { initials: "KA", name: "Kofi Akoto", role: "Admin" },
  { initials: "AB", name: "Ama Boateng", role: "Analyst" },
  { initials: "YM", name: "Yaw Mensah", role: "Viewer" },
]

export default function OnboardingStepFourPage() {
  return (
    <main className="carbon-page flex min-h-svh flex-col bg-background">
      <OnboardingTopBar
        className="fixed top-0 left-0 z-50 w-full"
        rightSlot={
          <>
            <button
              aria-label="Notifications"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              type="button"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              aria-label="Settings"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              type="button"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              aria-label="Help"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              type="button"
            >
              <CircleHelp className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              aria-label="Profile"
              className="inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              type="button"
            >
              <UserCircle2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        }
      />

      <div className="flex flex-1 justify-center px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="flex justify-center">
            <OnboardingStepper
              steps={["complete", "complete", "complete", "current"]}
            />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Final Review & Activation
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Step 4 of 4: Verify your enterprise details before launching your
              dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.55fr_0.85fr]">
            <section className="carbon-card bg-muted p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="carbon-kicker text-muted-foreground">
                    Entity details
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Business Profile
                  </h2>
                </div>
                <button
                  className="text-xs font-medium text-primary transition-colors hover:underline"
                  type="button"
                >
                  Edit
                </button>
              </div>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                    Company Name
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-foreground">
                    Gold Coast Tech Solutions LTD
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                    Registration No
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-foreground">
                    GHA-992031-X
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                    Primary Location
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-foreground">
                    Airport Residential Area, Accra
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                    Industry
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-foreground">
                    Information Technology & Services
                  </dd>
                </div>
              </dl>
            </section>

            <section className="carbon-card bg-muted p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="carbon-kicker text-muted-foreground">
                    Personnel
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    Team
                  </h2>
                </div>
                <button
                  className="text-xs font-medium text-primary transition-colors hover:underline"
                  type="button"
                >
                  Add
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center bg-primary/15 text-[11px] font-semibold text-primary">
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="carbon-card mt-4 bg-muted p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="carbon-kicker text-muted-foreground">
                  Fiscal setup
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  Financial Info
                </h2>
              </div>
              <button
                className="text-xs font-medium text-primary transition-colors hover:underline"
                type="button"
              >
                Update Accounts
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[0.7fr_0.7fr_1fr]">
              <div className="border border-border bg-background p-4">
                <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                  Currency
                </p>
                <p className="mt-3 text-sm font-medium text-foreground">GHS</p>
                <p className="text-xs text-muted-foreground">Ghana Cedi</p>
              </div>
              <div className="border border-border bg-background p-4">
                <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                  Tax ID (TIN)
                </p>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  C0012345678
                </p>
              </div>
              <div className="border border-border bg-background p-4">
                <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                  Linked Bank Account
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center bg-muted text-xs font-semibold text-foreground">
                    G
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      GCB Bank PLC - Main Operations
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Acc: **** 5521
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative mt-6 overflow-hidden bg-[#1e1e1e] px-6 py-12 text-center text-white sm:px-10">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute right-1/4 bottom-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-primary text-white">
                <Rocket className="h-7 w-7" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready for Launch
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/75">
                By clicking initialize, you confirm that all provided
                information is accurate and that your enterprise dashboard will
                be provisioned immediately.
              </p>

              <button className="carbon-button-primary mt-8" type="button">
                Initialize Dashboard
              </button>

              <div className="mt-5">
                <Link
                  className="text-sm text-white/70 transition-colors hover:text-white hover:underline"
                  href="/onboarding/step-3"
                >
                  Save as Draft and Exit
                </Link>
              </div>
            </div>
          </section>

          <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
            Ghana Business Hub operates under the Digital Transformation Act.
            Your data is encrypted and stored in compliance with local data
            protection regulations.{" "}
            <a className="text-primary hover:underline" href="#">
              View Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
