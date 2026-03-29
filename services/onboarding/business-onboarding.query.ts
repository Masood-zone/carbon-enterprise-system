"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
  clearBusinessOnboardingDraft,
  finalizeBusinessOnboarding,
  getBusinessOnboardingDraft,
  saveBusinessOnboardingStep,
} from "./business-onboarding"

const businessOnboardingQueryKeys = {
  draft: ["business", "onboarding", "draft"] as const,
}

export function useBusinessOnboardingDraftQuery() {
  return useQuery({
    queryKey: businessOnboardingQueryKeys.draft,
    queryFn: async () => getBusinessOnboardingDraft(),
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export function useSaveBusinessOnboardingStepMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveBusinessOnboardingStep,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: businessOnboardingQueryKeys.draft,
      })
    },
    onError: () => {
      toast.error("Unable to save onboarding draft")
    },
  })
}

export function useFinalizeBusinessOnboardingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: finalizeBusinessOnboarding,
    onSuccess: async () => {
      clearBusinessOnboardingDraft()
      await queryClient.invalidateQueries({
        queryKey: businessOnboardingQueryKeys.draft,
      })
      toast.success("Business onboarding completed")
    },
    onError: () => {
      toast.error("Unable to finalize onboarding")
    },
  })
}
