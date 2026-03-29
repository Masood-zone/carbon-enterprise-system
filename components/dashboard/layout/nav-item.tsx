"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { cn } from "@/lib/utils"

export type DashboardNavItemConfig = {
  icon: string
  name: string
  path: string
  roles: Array<"ADMIN" | "MANAGER">
}

export function DashboardNavItem({ item }: { item: DashboardNavItemConfig }) {
  const pathname = usePathname()
  const active = pathname === item.path || pathname.startsWith(`${item.path}/`)

  return (
    <Link
      className={cn(
        "group flex items-center gap-3 border-l-2 px-4 py-2.5 text-sm transition-colors",
        active
          ? "border-primary bg-muted text-primary"
          : "border-transparent text-foreground/75 hover:border-border hover:bg-muted/70 hover:text-foreground"
      )}
      href={item.path}
    >
      <MaterialSymbol
        className={cn("text-[18px] transition-colors", active && "filled")}
        icon={item.icon}
      />
      <span className="font-medium">{item.name}</span>
    </Link>
  )
}
