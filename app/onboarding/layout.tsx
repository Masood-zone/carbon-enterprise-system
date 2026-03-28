import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Business Onboarding",
  description:
    "Set up a new business profile, financial settings, team members, and final activation.",
}

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
