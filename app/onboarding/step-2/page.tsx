"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

import { ChevronLeft } from "lucide-react"

import {
  OnboardingStepper,
  OnboardingTopBar,
} from "@/components/onboarding/onboarding-ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ghanaBanks } from "@/utils/platform-data"
import {
  getBusinessOnboardingDraft,
  type FinanceSetupStepValues,
  useStoreBusinessOnboardingStep,
} from "@/services/onboarding/business-onboarding"

type OnboardingStepState = "complete" | "current" | "upcoming"

const stepProgress: OnboardingStepState[] = [
  "complete",
  "current",
  "upcoming",
  "upcoming",
]

export default function OnboardingStepTwoPage() {
  const router = useRouter()
  const storeStep = useStoreBusinessOnboardingStep()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FinanceSetupStepValues>({
    defaultValues: {
      bankName: "",
      accountNumber: "",
      tinNumber: "",
    },
  })

  useEffect(() => {
    const onboardingDraft = getBusinessOnboardingDraft()

    if (onboardingDraft.financeSetup) {
      reset(onboardingDraft.financeSetup)
    }
  }, [reset])

  const onSubmit = async (values: FinanceSetupStepValues) => {
    await storeStep.mutateAsync({
      stepKey: "finance-setup",
      values,
    })

    router.push("/onboarding/step-3")
  }

  return (
    <main className="carbon-page flex min-h-svh flex-col bg-muted/30">
      <OnboardingTopBar
        className="fixed top-0 left-0 z-50 w-full"
        compactBrandOnMobile
      />

      <div className="flex flex-1 justify-center px-4 py-16 pt-20 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="flex justify-center">
            <OnboardingStepper steps={stepProgress} />
          </div>

          <div className="mt-6 space-y-6">
            <section className="carbon-card w-full overflow-hidden bg-background shadow-sm">
              <div className="h-1 w-1/2 bg-primary" />

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
                  <p className="carbon-kicker text-muted-foreground">
                    Step 2 of 4
                  </p>
                  <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                    Finance Setup
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Capture the bank details and tax information required to
                    activate the business profile.
                  </p>

                  <div className="mt-8 space-y-8">
                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                        htmlFor="bankName"
                      >
                        Bank Name
                      </label>
                      <Controller
                        control={control}
                        name="bankName"
                        rules={{ required: "Bank name is required" }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full" id="bankName">
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent>
                              {ghanaBanks.map((bank) => (
                                <SelectItem key={bank.name} value={bank.name}>
                                  {bank.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.bankName ? (
                        <p className="text-xs font-medium text-destructive">
                          {errors.bankName.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                        htmlFor="accountNumber"
                      >
                        Account Number
                      </label>
                      <input
                        className="carbon-input"
                        id="accountNumber"
                        inputMode="numeric"
                        placeholder="Enter account number"
                        type="text"
                        aria-invalid={errors.accountNumber ? "true" : "false"}
                        {...register("accountNumber", {
                          required: "Account number is required",
                          minLength: {
                            value: 6,
                            message: "Account number must be at least 6 digits",
                          },
                        })}
                      />
                      {errors.accountNumber ? (
                        <p className="text-xs font-medium text-destructive">
                          {errors.accountNumber.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                        htmlFor="tinNumber"
                      >
                        TIN Number
                      </label>
                      <input
                        className="carbon-input"
                        id="tinNumber"
                        placeholder="P00XXXXXXXX"
                        type="text"
                        aria-invalid={errors.tinNumber ? "true" : "false"}
                        {...register("tinNumber", {
                          required: "TIN number is required",
                        })}
                      />
                      {errors.tinNumber ? (
                        <p className="text-xs font-medium text-destructive">
                          {errors.tinNumber.message}
                        </p>
                      ) : null}
                      <p className="text-xs text-muted-foreground">
                        This value maps to the business tax identification field
                        in the schema.
                      </p>
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
                  <button
                    className="carbon-button-primary w-full cursor-pointer sm:w-auto"
                    type="submit"
                    disabled={isSubmitting || storeStep.isPending}
                  >
                    <span>
                      {isSubmitting || storeStep.isPending
                        ? "Saving..."
                        : "Continue"}
                    </span>
                    <span className="text-base leading-none">→</span>
                  </button>
                </div>
              </form>
            </section>

            <aside className="space-y-4">
              <div className="carbon-card bg-background p-6 shadow-sm">
                <p className="carbon-kicker text-primary">Finance context</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  Foundation for reporting.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Banking and tax details help unify operational and financial
                  reporting inside the platform.
                </p>
              </div>

              <div className="carbon-card border border-border bg-muted p-6 shadow-sm">
                <p className="text-[11px] tracking-[0.28em] text-muted-foreground uppercase">
                  What is captured here
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-foreground">
                  <li>Preferred bank for the business</li>
                  <li>Main account number for settlements</li>
                  <li>Tax Identification Number for compliance</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
