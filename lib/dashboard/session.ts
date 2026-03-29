import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export type DashboardSession = NonNullable<
  Awaited<ReturnType<(typeof auth.api)["getSession"]>>
>

export type DashboardRole = "ADMIN" | "MANAGER"

export async function getDashboardSession() {
  const requestHeaders = await headers()
  return auth.api.getSession({ headers: requestHeaders })
}

export async function requireDashboardSession() {
  const session = await getDashboardSession()

  if (!session) {
    redirect("/login")
  }

  if (!session.user.businessId?.trim()) {
    redirect("/onboarding")
  }

  return session
}

export async function requireAdminDashboardSession() {
  const session = await requireDashboardSession()

  if (session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard")
  }

  return session
}

export function getDashboardRole(session: DashboardSession): DashboardRole {
  return session.user.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "MANAGER"
}

export async function fetchDashboardApi<T>(path: string): Promise<T> {
  const cookieStore = await cookies()
  const response = await fetch(new URL(path, siteUrl), {
    cache: "no-store",
    headers: {
      accept: "application/json",
      cookie: cookieStore.toString(),
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`)
  }

  const payload = (await response.json()) as T & {
    error?: string
    ok?: boolean
  }

  if (
    payload &&
    typeof payload === "object" &&
    "ok" in payload &&
    !payload.ok
  ) {
    throw new Error(payload.error ?? `Failed to load ${path}`)
  }

  return payload
}
