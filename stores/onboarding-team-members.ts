import { create } from "zustand"

import type { BusinessOnboardingRole } from "@/services/onboarding/business-onboarding"

export type TeamMemberDraft = {
  id: string
  fullName: string
  email: string
  role: BusinessOnboardingRole
}

type TeamMemberInput = Omit<TeamMemberDraft, "id">

type TeamMemberStore = {
  members: TeamMemberDraft[]
  addMember: (member?: Partial<TeamMemberInput>) => void
  removeMember: (id: string) => void
  updateMember: (id: string, updates: Partial<TeamMemberInput>) => void
  setMembers: (members: TeamMemberInput[]) => void
  resetMembers: () => void
}

function createMemberDraft(member?: Partial<TeamMemberInput>): TeamMemberDraft {
  return {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    fullName: member?.fullName ?? "",
    email: member?.email ?? "",
    role: member?.role ?? "MANAGER",
  }
}

export const useOnboardingTeamMembersStore = create<TeamMemberStore>((set) => ({
  members: [],
  addMember: (member) =>
    set((state) => ({
      members: [...state.members, createMemberDraft(member)],
    })),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
    })),
  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      ),
    })),
  setMembers: (members) =>
    set({
      members: members.map((member) => createMemberDraft(member)),
    }),
  resetMembers: () => set({ members: [] }),
}))
