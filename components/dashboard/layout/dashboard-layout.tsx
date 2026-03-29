import type { ReactNode } from "react"

import { DashboardHeader } from "./header"
import { DashboardSidebar } from "./sidebar"
import {
  getDashboardRole,
  type DashboardSession,
} from "@/lib/dashboard/session"

export function DashboardLayout({
  children,
  session,
}: {
  children: ReactNode
  session: DashboardSession
}) {
  const role = getDashboardRole(session)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <DashboardHeader
        email={session.user.email}
        image={session.user.image}
        name={session.user.name}
        role={role}
      />
      <DashboardSidebar
        role={role}
        userEmail={session.user.email}
        userName={session.user.name}
      />
      <main className="min-h-svh pt-12 lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
