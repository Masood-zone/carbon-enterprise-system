import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api, getAxiosErrorMessage } from "@/services/api/axios"
import { userSignUp } from "@/services/auth/user-auth"

export type BusinessOnboardingStepKey =
  | "business-info"
  | "finance-setup"
  | "team-setup"
  | "finalization"

export type BusinessOnboardingRole = "ADMIN" | "MANAGER"

export type BusinessOnboardingTeamMember = {
  fullName: string
  email: string
  role: BusinessOnboardingRole
}

export type BusinessInfoStepValues = {
  businessName: string
  industry: string
  region: string
  town: string
  currency: string
}

export type FinanceSetupStepValues = {
  bankName: string
  accountNumber: string
  tinNumber: string
}

export type TeamSetupStepValues = {
  adminName: string
  adminEmail: string
  adminPassword: string
  teamMembers: BusinessOnboardingTeamMember[]
}

export type BusinessOnboardingDraft = {
  businessInfo?: BusinessInfoStepValues
  financeSetup?: FinanceSetupStepValues
  teamSetup?: TeamSetupStepValues
  finalizedBusinessId?: string
  completed?: boolean
}

type SaveBusinessOnboardingStepResponse = {
  completed: boolean
  ok: boolean
  onboarding: BusinessOnboardingDraft
}

type CompleteBusinessOnboardingResponse = {
  businessId: string
  ok: boolean
  onboarding: BusinessOnboardingDraft
  userId?: string
}

const BUSINESS_ONBOARDING_STORAGE_KEY =
  "carbon-enterprise-business-onboarding-draft"

function getWindowStorage() {
  if (typeof window === "undefined") {
    return null
  }

  return window.sessionStorage
}

export function getBusinessOnboardingDraft(): BusinessOnboardingDraft {
  const storage = getWindowStorage()

  if (!storage) {
    return {}
  }

  const rawValue = storage.getItem(BUSINESS_ONBOARDING_STORAGE_KEY)

  if (!rawValue) {
    return {}
  }

  try {
    return JSON.parse(rawValue) as BusinessOnboardingDraft
  } catch {
    storage.removeItem(BUSINESS_ONBOARDING_STORAGE_KEY)
    return {}
  }
}

export function saveBusinessOnboardingDraft(draft: BusinessOnboardingDraft) {
  const storage = getWindowStorage()

  if (!storage) {
    return
  }

  storage.setItem(BUSINESS_ONBOARDING_STORAGE_KEY, JSON.stringify(draft))
}

export function clearBusinessOnboardingDraft() {
  const storage = getWindowStorage()

  if (!storage) {
    return
  }

  storage.removeItem(BUSINESS_ONBOARDING_STORAGE_KEY)
}

function mergeDraftStep(
  currentDraft: BusinessOnboardingDraft,
  stepKey: Exclude<BusinessOnboardingStepKey, "finalization">,
  values: BusinessInfoStepValues | FinanceSetupStepValues | TeamSetupStepValues
): BusinessOnboardingDraft {
  if (stepKey === "business-info") {
    return {
      ...currentDraft,
      businessInfo: values as BusinessInfoStepValues,
    }
  }

  if (stepKey === "finance-setup") {
    return {
      ...currentDraft,
      financeSetup: values as FinanceSetupStepValues,
    }
  }

  return {
    ...currentDraft,
    teamSetup: values as TeamSetupStepValues,
  }
}

export async function saveBusinessOnboardingStep({
  stepKey,
  values,
}: {
  stepKey: Exclude<BusinessOnboardingStepKey, "finalization">
  values: BusinessInfoStepValues | FinanceSetupStepValues | TeamSetupStepValues
}): Promise<SaveBusinessOnboardingStepResponse> {
  const currentDraft = getBusinessOnboardingDraft()
  const onboarding = mergeDraftStep(currentDraft, stepKey, values)

  saveBusinessOnboardingDraft(onboarding)

  return {
    completed: false,
    ok: true,
    onboarding,
  }
}

export async function finalizeBusinessOnboarding(): Promise<CompleteBusinessOnboardingResponse> {
  const onboarding = getBusinessOnboardingDraft()

  if (!onboarding.businessInfo) {
    throw new Error("Business information is required before finalization")
  }

  if (!onboarding.financeSetup) {
    throw new Error("Finance setup is required before finalization")
  }

  if (!onboarding.teamSetup) {
    throw new Error("Account setup is required before finalization")
  }

  const adminEmail = onboarding.teamSetup.adminEmail.trim()
  const adminPassword = onboarding.teamSetup.adminPassword
  const adminName = onboarding.teamSetup.adminName.trim()

  if (!adminEmail) {
    throw new Error("Admin email is required before finalization")
  }

  if (!adminPassword) {
    throw new Error("Admin password is required before finalization")
  }

  const signUpResult = await userSignUp({
    name: adminName || onboarding.businessInfo.businessName,
    email: adminEmail,
    password: adminPassword,
  })

  if (signUpResult?.error) {
    throw new Error(
      signUpResult.error.message || "Unable to create the admin account"
    )
  }

  const response = await api.post<CompleteBusinessOnboardingResponse>(
    "/api/onboarding/business/complete",
    {
      onboarding,
    }
  )

  clearBusinessOnboardingDraft()

  return response.data
}

export function useStoreBusinessOnboardingStep() {
  return useMutation({
    mutationFn: saveBusinessOnboardingStep,
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message)
    },
  })
}

export function useFinalizeBusinessOnboarding() {
  return useMutation({
    mutationFn: finalizeBusinessOnboarding,
    onError: (error) => {
      const message = getAxiosErrorMessage(error)
      toast.error(message)
    },
    onSuccess: () => {
      toast.success("Business onboarding completed")
    },
  })
}
