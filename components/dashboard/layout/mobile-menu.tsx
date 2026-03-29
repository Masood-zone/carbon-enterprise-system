"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { CarbonBrand } from "@/components/carbon-brand"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { userLogout } from "@/services/auth/user-auth"
import { cn } from "@/lib/utils"

import { DashboardNavItem } from "./nav-item"
import { getVisibleDashboardNavItems } from "./nav-config"

export function DashboardMobileMenu({
  role,
  userEmail,
  userName,
}: {
  role: "ADMIN" | "MANAGER"
  userEmail?: string | null
  userName?: string | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const visibleItems = getVisibleDashboardNavItems(role)

  async function handleLogout() {
    await userLogout()
    setOpen(false)
    router.replace("/login")
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <Button
        aria-label="Open navigation menu"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        size="icon-sm"
        variant="ghost"
      >
        <MaterialSymbol className="text-[18px]" icon="menu" />
      </Button>

      <DialogContent
        className="!top-0 !left-0 !h-[100svh] !w-[min(88vw,20rem)] !max-w-none !translate-x-0 !translate-y-0 !rounded-none !p-0"
        showCloseButton={false}
      >
        <div className="flex h-full flex-col overflow-hidden bg-background">
          <DialogHeader className="shrink-0 border-b border-border px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <CarbonBrand compactOnMobile />
              <DialogClose
                render={
                  <Button
                    aria-label="Close navigation menu"
                    size="icon-sm"
                    variant="ghost"
                  />
                }
                onClick={() => setOpen(false)}
              >
                <MaterialSymbol className="text-[18px]" icon="close" />
              </DialogClose>
            </div>
            <p className="text-xs text-muted-foreground">
              {role === "ADMIN"
                ? "Business administration"
                : "Business operations"}
            </p>
          </DialogHeader>

          <nav className="min-h-0 flex-1 overflow-y-auto py-2">
            <div className="space-y-1">
              {visibleItems.map((item) => (
                <div key={item.path} onClick={() => setOpen(false)}>
                  <DashboardNavItem item={item} />
                </div>
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
      </DialogContent>
    </Dialog>
  )
}
