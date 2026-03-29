"use client"

import { useRouter } from "next/navigation"

import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { userLogout } from "@/services/auth/user-auth"
import { getInitials } from "@/lib/utils"

import { DashboardMobileMenu } from "./mobile-menu"

export function DashboardHeader({
  email,
  image,
  name,
  role,
}: {
  email?: string | null
  image?: string | null
  name?: string | null
  role: "ADMIN" | "MANAGER"
}) {
  const router = useRouter()
  const initials = getInitials(name ?? email ?? "User")

  async function handleLogout() {
    await userLogout()
    router.replace("/login")
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 h-12 border-b border-border bg-background/95 backdrop-blur lg:left-64">
      <div className="flex h-full items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <DashboardMobileMenu userEmail={email} userName={name} role={role} />
          <div className="hidden items-center gap-2 lg:flex">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Carbon Enterprise
            </p>
            <span className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
              {role === "ADMIN" ? "Admin" : "Manager"}
            </span>
          </div>

          {/* <label className="hidden h-8 w-[20rem] items-center gap-2 border border-border bg-muted px-3 text-xs text-muted-foreground md:flex">
            <MaterialSymbol className="text-[18px]" icon="search" />
            <span>Search data, reports, products...</span>
          </label> */}
        </div>

        <div className="flex items-center gap-1">
          <Button
            aria-label="Notifications"
            className="text-muted-foreground"
            size="icon-sm"
            variant="ghost"
          >
            <MaterialSymbol className="text-[18px]" icon="notifications" />
          </Button>
          <Button
            aria-label="Settings"
            className="text-muted-foreground"
            size="icon-sm"
            variant="ghost"
            onClick={() => router.push("/dashboard/settings")}
          >
            <MaterialSymbol className="text-[18px]" icon="settings" />
          </Button>
          <Button
            aria-label="Help"
            className="text-muted-foreground"
            size="icon-sm"
            variant="ghost"
            onClick={() => router.push("/dashboard/reports")}
          >
            <MaterialSymbol className="text-[18px]" icon="help" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 flex items-center gap-2 rounded-none border border-border px-2 py-1 hover:bg-muted">
              <Avatar size="sm">
                <AvatarImage alt={name ?? "User"} src={image ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium text-foreground">
                  {name ?? "Account"}
                </p>
                <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {role}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-52">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-foreground">
                  {name ?? "Signed in user"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                <MaterialSymbol className="text-[16px]" icon="dashboard" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
              >
                <MaterialSymbol className="text-[16px]" icon="settings" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => void handleLogout()}>
                <MaterialSymbol className="text-[16px]" icon="logout" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
