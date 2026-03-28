import type { ReactNode } from "react"

import { Check, ChevronRight } from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"
import { cn } from "@/lib/utils"

type OnboardingTopBarProps = {
  rightSlot?: ReactNode
  className?: string
  compactBrandOnMobile?: boolean
}

function OnboardingTopBar({
  rightSlot,
  className,
  compactBrandOnMobile = true,
}: OnboardingTopBarProps) {
  return (
    <header className={cn("border-b border-border bg-background", className)}>
      <div className="carbon-section flex h-auto items-start justify-between gap-3 py-2 sm:h-12 sm:items-center sm:gap-4">
        <CarbonBrand compactOnMobile={compactBrandOnMobile} />
        {rightSlot ? (
          <div className="flex max-w-full flex-wrap items-center justify-end gap-1 sm:gap-2">
            {rightSlot}
          </div>
        ) : null}
      </div>
    </header>
  )
}

type OnboardingProgressBarProps = {
  stepLabel: string
  title: string
  description: string
  progressWidthClass: "w-1/4" | "w-1/2" | "w-3/4" | "w-full"
  percentLabel?: string
}

function OnboardingProgressBar({
  stepLabel,
  title,
  description,
  progressWidthClass,
  percentLabel,
}: OnboardingProgressBarProps) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="carbon-kicker text-primary">{stepLabel}</p>
          <h1 className="mt-2 text-2xl font-normal tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {percentLabel ? (
          <span className="text-sm font-medium text-muted-foreground">
            {percentLabel}
          </span>
        ) : null}
      </div>
      <div className="mt-4 h-1 w-full bg-border">
        <div className={cn("h-full bg-primary", progressWidthClass)} />
      </div>
    </div>
  )
}

type OnboardingStepperProps = {
  steps: Array<"complete" | "current" | "upcoming">
}

function OnboardingStepper({ steps }: OnboardingStepperProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
      {steps.map((state, index) => {
        const stepNumber = index + 1

        if (state === "complete") {
          return (
            <div
              key={`step-${stepNumber}`}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <span className="flex h-6 w-6 items-center justify-center bg-green-700 text-white">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {stepNumber < steps.length ? (
                <div className="h-px w-8 bg-green-300 sm:w-10" />
              ) : null}
            </div>
          )
        }

        if (state === "current") {
          return (
            <div
              key={`step-${stepNumber}`}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <span className="flex h-6 w-6 items-center justify-center bg-primary text-[11px] font-semibold text-primary-foreground">
                {stepNumber}
              </span>
              {stepNumber < steps.length ? (
                <div className="h-px w-8 bg-primary/30 sm:w-10" />
              ) : null}
            </div>
          )
        }

        return (
          <div
            key={`step-${stepNumber}`}
            className="flex items-center gap-1.5 sm:gap-2"
          >
            <span className="flex h-6 w-6 items-center justify-center border border-border text-[11px] font-semibold text-muted-foreground">
              {stepNumber}
            </span>
            {stepNumber < steps.length ? (
              <div className="h-px w-8 bg-border sm:w-10" />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

type OnboardingActionLinkProps = {
  href: string
  children: ReactNode
  className?: string
}

function OnboardingActionLink({
  href,
  children,
  className,
}: OnboardingActionLinkProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline",
        className
      )}
      href={href}
    >
      {children}
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
    </a>
  )
}

export {
  OnboardingActionLink,
  OnboardingProgressBar,
  OnboardingStepper,
  OnboardingTopBar,
}
