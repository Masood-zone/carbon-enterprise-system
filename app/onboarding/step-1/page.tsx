"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"

import { BarChart3, CircleHelp, MapPinned, UserCircle2 } from "lucide-react"

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
import {
  businessIndustries,
  getTownOptions,
  ghanaRegions,
} from "@/utils/platform-data"
import {
  getBusinessOnboardingDraft,
  type BusinessInfoStepValues,
  useStoreBusinessOnboardingStep,
} from "@/services/onboarding/business-onboarding"

type OnboardingStepState = "complete" | "current" | "upcoming"

const stepProgress: OnboardingStepState[] = [
  "current",
  "upcoming",
  "upcoming",
  "upcoming",
]

export default function OnboardingStepOnePage() {
  const router = useRouter()
  const storeStep = useStoreBusinessOnboardingStep()

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessInfoStepValues>({
    defaultValues: {
      businessName: "",
      industry: "",
      region: "",
      town: "",
      currency: "GHS",
    },
  })

  const region = useWatch({ control, name: "region" })
  const selectedTown = useWatch({ control, name: "town" })
  const townOptions = getTownOptions(region)

  useEffect(() => {
    const onboardingDraft = getBusinessOnboardingDraft()

    if (onboardingDraft.businessInfo) {
      reset(onboardingDraft.businessInfo)
      return
    }

    setValue("currency", "GHS")
  }, [reset, setValue])

  useEffect(() => {
    const regionTownOptions = getTownOptions(region)

    if (region && selectedTown && !regionTownOptions.includes(selectedTown)) {
      setValue("town", "")
    }
  }, [region, selectedTown, setValue])

  const onSubmit = async (values: BusinessInfoStepValues) => {
    await storeStep.mutateAsync({
      stepKey: "business-info",
      values: {
        ...values,
        currency: "GHS",
      },
    })

    router.push("/onboarding/step-2")
  }

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
        <div className="w-full max-w-4xl">
          <div className="flex justify-center">
            <OnboardingStepper steps={stepProgress} />
          </div>

          <div className="mt-6 space-y-6">
            <section className="carbon-card w-full overflow-hidden bg-background shadow-sm">
              <div className="h-1 w-1/4 bg-primary" />

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="border-b border-border px-6 py-8 sm:px-10 sm:py-10">
                  <p className="carbon-kicker text-muted-foreground">
                    Step 1 of 4
                  </p>
                  <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
                    Business Information
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Start by defining the business that will power the full
                    onboarding flow and the analytics workspace.
                  </p>

                  <div className="mt-8 space-y-6">
                    <div className="space-y-2">
                      <label
                        className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                        htmlFor="businessName"
                      >
                        Business Name
                      </label>
                      <input
                        className="carbon-input"
                        id="businessName"
                        placeholder="e.g. Accra Digital Ventures"
                        type="text"
                        aria-invalid={errors.businessName ? "true" : "false"}
                        {...register("businessName", {
                          required: "Business name is required",
                        })}
                      />
                      {errors.businessName ? (
                        <p className="text-xs font-medium text-destructive">
                          {errors.businessName.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                          htmlFor="industry"
                        >
                          Industry
                        </label>
                        <Controller
                          control={control}
                          name="industry"
                          rules={{ required: "Industry is required" }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full" id="industry">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {businessIndustries.map((industry) => (
                                  <SelectItem
                                    key={industry.name}
                                    value={industry.name}
                                  >
                                    {industry.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.industry ? (
                          <p className="text-xs font-medium text-destructive">
                            {errors.industry.message}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label
                          className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                          htmlFor="region"
                        >
                          Region
                        </label>
                        <Controller
                          control={control}
                          name="region"
                          rules={{ required: "Region is required" }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-full" id="region">
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                {ghanaRegions.map((regionOption) => (
                                  <SelectItem
                                    key={regionOption.name}
                                    value={regionOption.name}
                                  >
                                    {regionOption.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.region ? (
                          <p className="text-xs font-medium text-destructive">
                            {errors.region.message}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          className="text-xs font-semibold tracking-[0.28em] text-foreground uppercase"
                          htmlFor="town"
                        >
                          Town / City
                        </label>
                        <Controller
                          control={control}
                          name="town"
                          rules={{ required: "Town is required" }}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!region}
                            >
                              <SelectTrigger className="w-full" id="town">
                                <SelectValue
                                  placeholder={
                                    region
                                      ? "Select town"
                                      : "Select region first"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {townOptions.map((town) => (
                                  <SelectItem key={town} value={town}>
                                    {town}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.town ? (
                          <p className="text-xs font-medium text-destructive">
                            {errors.town.message}
                          </p>
                        ) : null}
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
                            <span>GHS - Ghanaian Cedi</span>
                          </div>
                          <MapPinned
                            className="h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Currency is fixed to GHS for the current rollout.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                  <Link
                    className="text-sm font-medium text-primary transition-colors hover:underline"
                    href="/login"
                  >
                    Already registered? Sign in
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
                <p className="carbon-kicker text-primary">Why this matters</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  Make the forecast relevant.
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Regions, industry, and business context shape the trend models
                  and improve the quality of forward-looking analytics.
                </p>
              </div>

              <div className="carbon-card overflow-hidden bg-primary/10 shadow-sm">
                <div className="grid gap-0 lg:grid-cols-[2fr_1fr]">
                  <div className="p-6 sm:p-8">
                    <p className="carbon-kicker text-primary">
                      Analytics ready
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                      Connecting local insights.
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                      Establish the operational profile that powers reporting,
                      inventory visibility, and business context.
                    </p>
                  </div>
                  <div className="flex items-center justify-center bg-[#a7f0ba] p-8">
                    <div className="flex h-14 w-14 items-center justify-center bg-foreground text-background">
                      <BarChart3 className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Need assistance setting up?{" "}
            <a
              className="text-primary hover:underline"
              href="tel:+233537911910"
            >
              Contact Enterprise Support
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
