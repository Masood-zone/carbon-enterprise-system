"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { ChevronLeft, Plus, Trash2 } from "lucide-react"

import {
  OnboardingStepper,
  OnboardingTopBar,
} from "@/components/onboarding/onboarding-ui"
import {
  getBusinessOnboardingDraft,
  type TeamSetupStepValues,
  useStoreBusinessOnboardingStep,
} from "@/services/onboarding/business-onboarding"
import {
  useOnboardingTeamMembersStore,
  type TeamMemberDraft,
} from "@/stores/onboarding-team-members"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type OnboardingStepState = "complete" | "current" | "upcoming"

const stepProgress: OnboardingStepState[] = [
  "complete",
  "complete",
  "current",
  "upcoming",
]

function createEmptyTeamMember() {
  return { fullName: "", email: "", role: "MANAGER" as const }
}

function TeamMemberRow({
  member,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  member: TeamMemberDraft
  index: number
  onChange: (updates: Partial<Omit<TeamMemberDraft, "id">>) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <article className="border border-border bg-background p-4">
      <div className="grid gap-4 md:grid-cols-[1.2fr_1.1fr_0.7fr_auto] md:items-end">
        <div className="space-y-2">
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor={`teamMembers.${index}.fullName`}
          >
            Full Name
          </label>
          <input
            className="carbon-input"
            id={`teamMembers.${index}.fullName`}
            placeholder="e.g. Ama Boateng"
            type="text"
            value={member.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor={`teamMembers.${index}.email`}
          >
            Email
          </label>
          <input
            className="carbon-input"
            id={`teamMembers.${index}.email`}
            placeholder="member@company.com"
            type="email"
            value={member.email}
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-xs font-medium text-muted-foreground"
            htmlFor={`teamMembers.${index}.role`}
          >
            Role
          </label>
          <Select
            onValueChange={(value) =>
              onChange({ role: value === "ADMIN" ? "ADMIN" : "MANAGER" })
            }
            value={member.role}
          >
            <SelectTrigger className="w-full" id={`teamMembers.${index}.role`}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="MANAGER">MANAGER</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <button
            aria-label={`Remove member ${index + 1}`}
            className="inline-flex h-11 items-center justify-center border border-border bg-background px-3 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function OnboardingStepThreePage() {
  const router = useRouter()
  const storeStep = useStoreBusinessOnboardingStep()
  const members = useOnboardingTeamMembersStore((state) => state.members)
  const addMember = useOnboardingTeamMembersStore((state) => state.addMember)
  const removeMember = useOnboardingTeamMembersStore(
    (state) => state.removeMember
  )
  const updateMember = useOnboardingTeamMembersStore(
    (state) => state.updateMember
  )
  const setMembers = useOnboardingTeamMembersStore((state) => state.setMembers)
  const resetMembers = useOnboardingTeamMembersStore(
    (state) => state.resetMembers
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamSetupStepValues>({
    defaultValues: {
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      teamMembers: [],
    },
  })

  useEffect(() => {
    const onboardingDraft = getBusinessOnboardingDraft()

    if (onboardingDraft.teamSetup) {
      reset(onboardingDraft.teamSetup)
      setMembers(onboardingDraft.teamSetup.teamMembers)
    }
  }, [reset, setMembers])

  const onSubmit = async (values: TeamSetupStepValues) => {
    await storeStep.mutateAsync({
      stepKey: "team-setup",
      values: {
        ...values,
        teamMembers: members.map((member) => ({
          fullName: member.fullName,
          email: member.email,
          role: member.role,
        })),
      },
    })

    resetMembers()

    router.push("/onboarding/step-4")
  }

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
        <div className="w-full max-w-5xl">
          <div className="flex justify-center">
            <OnboardingStepper steps={stepProgress} />
          </div>

          <div className="mt-6 space-y-6">
            <section className="carbon-card w-full overflow-hidden bg-background shadow-sm">
              <div className="h-1 w-3/4 bg-primary" />

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
                  <p className="carbon-kicker text-muted-foreground">
                    Step 3 of 4
                  </p>
                  <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                    Account and Team Setup
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Create the admin account and capture any additional members
                    you want staged for the business.
                  </p>

                  <div className="mt-8 space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-1">
                        <label
                          className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                          htmlFor="adminName"
                        >
                          Admin Name
                        </label>
                        <input
                          className="carbon-input"
                          id="adminName"
                          placeholder="e.g. Kwame Mensah"
                          type="text"
                          aria-invalid={errors.adminName ? "true" : "false"}
                          {...register("adminName", {
                            required: "Admin name is required",
                          })}
                        />
                        {errors.adminName ? (
                          <p className="text-xs font-medium text-destructive">
                            {errors.adminName.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2 md:col-span-1">
                        <label
                          className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                          htmlFor="adminEmail"
                        >
                          Admin Email
                        </label>
                        <input
                          className="carbon-input"
                          id="adminEmail"
                          placeholder="admin@company.com"
                          type="email"
                          aria-invalid={errors.adminEmail ? "true" : "false"}
                          {...register("adminEmail", {
                            required: "Admin email is required",
                          })}
                        />
                        {errors.adminEmail ? (
                          <p className="text-xs font-medium text-destructive">
                            {errors.adminEmail.message}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                        htmlFor="adminPassword"
                      >
                        Admin Password
                      </label>
                      <input
                        className="carbon-input"
                        id="adminPassword"
                        placeholder="Create a secure password"
                        type="password"
                        aria-invalid={errors.adminPassword ? "true" : "false"}
                        {...register("adminPassword", {
                          required: "Admin password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                      />
                      {errors.adminPassword ? (
                        <p className="text-xs font-medium text-destructive">
                          {errors.adminPassword.message}
                        </p>
                      ) : null}
                    </div>

                    <section className="border border-border bg-muted p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="carbon-kicker text-muted-foreground">
                            Additional team members
                          </p>
                          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                            Admin and manager roles only
                          </h2>
                        </div>
                        <button
                          className="carbon-button-secondary"
                          type="button"
                          onClick={() => addMember(createEmptyTeamMember())}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                          Add Another Member
                        </button>
                      </div>

                      <div className="mt-6 space-y-4">
                        {members.length > 0 ? (
                          members.map((member, index) => (
                            <TeamMemberRow
                              key={member.id}
                              member={member}
                              index={index}
                              onChange={(updates) =>
                                updateMember(member.id, updates)
                              }
                              onRemove={() => removeMember(member.id)}
                              canRemove={members.length > 0}
                            />
                          ))
                        ) : (
                          <div className="border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                            No additional team members have been added yet.
                          </div>
                        )}
                      </div>

                      <p className="mt-4 text-xs leading-5 text-muted-foreground">
                        You can add as many ADMIN and MANAGER members as you
                        need during onboarding. Members are captured now and can
                        be activated after launch.
                      </p>
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
                  <button
                    className="carbon-button-primary w-full cursor-pointer sm:w-auto"
                    type="submit"
                    disabled={isSubmitting || storeStep.isPending}
                  >
                    <span>
                      {isSubmitting || storeStep.isPending
                        ? "Saving..."
                        : "Continue to Review"}
                    </span>
                    <span className="text-base leading-none">→</span>
                  </button>
                </div>
              </form>
            </section>

            <aside className="space-y-4">
              <div className="carbon-card bg-background p-6 shadow-sm">
                <p className="carbon-kicker text-primary">Account flow</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  The admin account anchors the business.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  The final step will create the admin account and attach it to
                  the business record.
                </p>
              </div>

              <div className="carbon-card border border-border bg-muted p-6 shadow-sm">
                <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                  Team member rules
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground">
                  <li>Only ADMIN and MANAGER roles are available.</li>
                  <li>Email and name are required for every team member.</li>
                  <li>
                    Add more members by using the Add Another Member button.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
