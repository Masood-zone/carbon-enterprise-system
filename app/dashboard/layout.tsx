import type { ReactNode } from "react"

import { DashboardLayout as DashboardShell } from "@/components/dashboard/layout/dashboard-layout"
import { requireDashboardSession } from "@/lib/dashboard/session"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await requireDashboardSession()

  return <DashboardShell session={session}>{children}</DashboardShell>
}
