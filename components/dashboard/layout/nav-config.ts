import type { DashboardRole } from "@/lib/dashboard/session"

export type DashboardNavItemConfig = {
  icon: string
  name: string
  path: string
  roles: DashboardRole[]
}

export const NAV_ITEMS: DashboardNavItemConfig[] = [
  {
    icon: "dashboard",
    name: "Dashboard",
    path: "/dashboard",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    icon: "inventory_2",
    name: "Products",
    path: "/dashboard/products",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    icon: "warehouse",
    name: "Inventory",
    path: "/dashboard/inventory",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    icon: "receipt_long",
    name: "Transactions",
    path: "/dashboard/transactions",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    icon: "groups",
    name: "Customers",
    path: "/dashboard/customers",
    roles: ["ADMIN", "MANAGER"],
  },
  {
    icon: "paid",
    name: "Expenses",
    path: "/dashboard/expenses",
    roles: ["ADMIN"],
  },
  {
    icon: "request_page",
    name: "Reports",
    path: "/dashboard/reports",
    roles: ["ADMIN"],
  },
  {
    icon: "query_stats",
    name: "Analytics",
    path: "/dashboard/analytics",
    roles: ["ADMIN"],
  },
  {
    icon: "manage_accounts",
    name: "Users",
    path: "/dashboard/users",
    roles: ["ADMIN"],
  },
  {
    icon: "settings",
    name: "Settings",
    path: "/dashboard/settings",
    roles: ["ADMIN"],
  },
]

export function getVisibleDashboardNavItems(role: DashboardRole) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role))
}
