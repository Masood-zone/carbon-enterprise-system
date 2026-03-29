"use client"

import { useRouter } from "next/navigation"

import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { userLogout } from "@/services/auth/user-auth"
import { cn } from "@/lib/utils"

import { CarbonBrand } from "@/components/carbon-brand"
import { DashboardNavItem } from "./nav-item"
import { getVisibleDashboardNavItems } from "./nav-config"

export function DashboardSidebar({
  role,
  userEmail,
  userName,
}: {
  role: "ADMIN" | "MANAGER"
  userEmail?: string | null
  userName?: string | null
}) {
  const router = useRouter()
  const visibleItems = getVisibleDashboardNavItems(role)

  async function handleLogout() {
    await userLogout()
    router.replace("/login")
  }

  return (
    <aside className="fixed left-0 hidden h-[calc(100vh-3rem)] w-64 border-r border-border bg-background lg:block">
      <div className="flex h-full flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border px-4 py-3">
          <CarbonBrand compactOnMobile />
          <p className="mt-1 text-xs text-muted-foreground">
            {role === "ADMIN"
              ? "Business administration"
              : "Business operations"}
          </p>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto py-2">
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <DashboardNavItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        <footer className="shrink-0 border-t border-border p-4">
          <div className="mb-4 flex items-center gap-3 rounded-none border border-border bg-muted px-3 py-2">
            <MaterialSymbol
              className="text-[18px] text-muted-foreground"
              icon="support_agent"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">Support</p>
              <a
                className="block truncate text-xs text-muted-foreground hover:text-foreground"
                href="mailto:support@carbonenterprise.app"
              >
                {userEmail ?? "support@carbonenterprise.app"}
              </a>
            </div>
          </div>

          <div className={cn("space-y-1", userName && "mb-4")}>
            {userName ? (
              <p className="truncate text-xs font-medium text-foreground">
                {userName}
              </p>
            ) : null}
            <p className="truncate text-xs text-muted-foreground">
              {userEmail ?? "Signed in user"}
            </p>
          </div>

          <button
            className="flex w-full items-center gap-3 px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            onClick={() => {
              void handleLogout()
            }}
            type="button"
          >
            <MaterialSymbol className="text-[18px]" icon="logout" />
            <span>Logout</span>
          </button>
        </footer>
      </div>
    </aside>
  )
}
