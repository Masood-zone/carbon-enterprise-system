"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import {
  Bell,
  CircleHelp,
  Rocket,
  Settings,
  UserCircle2,
  Check,
} from "lucide-react"

import {
  OnboardingStepper,
  OnboardingTopBar,
} from "@/components/onboarding/onboarding-ui"
import {
  clearBusinessOnboardingDraft,
  getBusinessOnboardingDraft,
  type BusinessOnboardingDraft,
  useFinalizeBusinessOnboarding,
} from "@/services/onboarding/business-onboarding"

type OnboardingStepState = "complete" | "current" | "upcoming"

const stepProgress: OnboardingStepState[] = [
  "complete",
  "complete",
  "complete",
  "current",
]

function TeamMemberChip({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 border border-border bg-background p-3">
      <div className="flex h-9 w-9 items-center justify-center bg-primary/15 text-[11px] font-semibold text-primary">
        {initials || "U"}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  )
}

export default function OnboardingStepFourPage() {
  const router = useRouter()
  const finalizeOnboarding = useFinalizeBusinessOnboarding()
  const [draft, setDraft] = useState<BusinessOnboardingDraft>({})

  useEffect(() => {
    const onboardingDraft = getBusinessOnboardingDraft()
    setDraft(onboardingDraft)
  }, [])

  const teamMembers = useMemo(() => draft.teamSetup?.teamMembers ?? [], [draft])

  const handleFinalize = async () => {
    await finalizeOnboarding.mutateAsync()
    clearBusinessOnboardingDraft()
    router.push("/dashboard")
    router.refresh()
  }

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
        <div className="w-full max-w-5xl">
          <div className="flex justify-center">
            <OnboardingStepper steps={stepProgress} />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Final Review and Activation
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Confirm the business details before we create the account and
              provision the workspace.
            </p>
          </div>

          {!draft.businessInfo || !draft.financeSetup || !draft.teamSetup ? (
            <section className="carbon-card mt-10 bg-muted p-6 text-sm leading-6 text-muted-foreground">
              The onboarding draft is incomplete. Please return to the previous
              steps and complete all required fields before finalizing.
              <div className="mt-4">
                <Link
                  className="text-primary hover:underline"
                  href="/onboarding/step-1"
                >
                  Start from Step 1
                </Link>
              </div>
            </section>
          ) : (
            <>
              <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                <section className="carbon-card bg-muted p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="carbon-kicker text-muted-foreground">
                        Business details
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                        {draft.businessInfo.businessName}
                      </h2>
                    </div>
                    <Link
                      className="text-xs font-medium text-primary transition-colors hover:underline"
                      href="/onboarding/step-1"
                    >
                      Edit
                    </Link>
                  </div>

                  <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                    <div>
                      <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                        Industry
                      </dt>
                      <dd className="mt-2 text-sm font-medium text-foreground">
                        {draft.businessInfo.industry}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                        Region
                      </dt>
                      <dd className="mt-2 text-sm font-medium text-foreground">
                        {draft.businessInfo.region}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                        Town / City
                      </dt>
                      <dd className="mt-2 text-sm font-medium text-foreground">
                        {draft.businessInfo.town}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                        Currency
                      </dt>
                      <dd className="mt-2 text-sm font-medium text-foreground">
                        {draft.businessInfo.currency}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="carbon-card bg-muted p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="carbon-kicker text-muted-foreground">
                        Team
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                        {draft.teamSetup.adminName}
                      </h2>
                    </div>
                    <Link
                      className="text-xs font-medium text-primary transition-colors hover:underline"
                      href="/onboarding/step-3"
                    >
                      Edit
                    </Link>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 rounded-none border border-border bg-background p-3">
                      <div className="flex h-9 w-9 items-center justify-center bg-primary text-xs font-semibold text-primary-foreground">
                        AD
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {draft.teamSetup.adminEmail}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Admin account
                        </p>
                      </div>
                    </div>

                    {teamMembers.length > 0 ? (
                      <div className="space-y-3">
                        {teamMembers.map((member) => (
                          <TeamMemberChip
                            key={`${member.email}-${member.fullName}`}
                            name={member.fullName}
                            role={member.role}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-none border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                        No additional members were added.
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <section className="carbon-card mt-4 bg-muted p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="carbon-kicker text-muted-foreground">
                      Finance setup
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                      Financial information
                    </h2>
                  </div>
                  <Link
                    className="text-xs font-medium text-primary transition-colors hover:underline"
                    href="/onboarding/step-2"
                  >
                    Edit
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_0.8fr_1fr]">
                  <div className="border border-border bg-background p-4">
                    <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                      Bank
                    </p>
                    <p className="mt-3 text-sm font-medium text-foreground">
                      {draft.financeSetup.bankName}
                    </p>
                  </div>
                  <div className="border border-border bg-background p-4">
                    <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                      Account Number
                    </p>
                    <p className="mt-3 text-sm font-medium text-foreground">
                      {draft.financeSetup.accountNumber}
                    </p>
                  </div>
                  <div className="border border-border bg-background p-4">
                    <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                      TIN
                    </p>
                    <p className="mt-3 text-sm font-semibold text-foreground">
                      {draft.financeSetup.tinNumber}
                    </p>
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
                    Ready for launch
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/75">
                    Finalizing will create the admin account, register the
                    business, and provision the initial workspace profile.
                  </p>

                  <button
                    className="carbon-button-primary mt-8 cursor-pointer"
                    type="button"
                    onClick={handleFinalize}
                    disabled={finalizeOnboarding.isPending}
                  >
                    {finalizeOnboarding.isPending
                      ? "Initializing..."
                      : "Initialize Dashboard"}
                  </button>

                  <div className="mt-5">
                    <Link
                      className="text-sm text-white/70 transition-colors hover:text-white hover:underline"
                      href="/onboarding/step-3"
                    >
                      Save draft and go back
                    </Link>
                  </div>
                </div>
              </section>
            </>
          )}

          <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
            The onboarding draft is saved in the current browser session until
            the final activation step completes.{" "}
            <a className="text-primary hover:underline" href="#">
              View Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
