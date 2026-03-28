import Link from "next/link"

import {
  ArrowRight,
  BarChart3,
  Boxes,
  ClipboardList,
  Settings2,
} from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"

export const metadata = {
  title: "Dashboard",
  description: "Authenticated workspace dashboard for Carbon Enterprise.",
}

const quickActions = [
  {
    title: "Inventory",
    description: "Review products, stock levels, and incoming updates.",
    icon: Boxes,
  },
  {
    title: "Reports",
    description: "Track sales, orders, and operational performance.",
    icon: BarChart3,
  },
  {
    title: "Tasks",
    description: "Keep onboarding, approvals, and follow-ups moving.",
    icon: ClipboardList,
  },
  {
    title: "Settings",
    description: "Manage your workspace, branding, and preferences.",
    icon: Settings2,
  },
]

export default function DashboardPage() {
  return (
    <main className="carbon-page">
      <section className="carbon-section py-8 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <CarbonBrand compactOnMobile />
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            href="/"
          >
            Back to home
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="carbon-card p-8 sm:p-10">
            <p className="carbon-kicker">Authenticated workspace</p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Your dashboard is ready.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Use the account menu to move between the workspace, onboarding,
              and sign-out actions. This page gives logged-in users a stable
              destination while the rest of the product experience is expanded.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="carbon-button-primary" href="/onboarding">
                Continue onboarding
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link className="carbon-button-secondary" href="/login">
                Switch account
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {quickActions.map((action) => {
              const Icon = action.icon

              return (
                <article key={action.title} className="carbon-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center border border-border bg-muted text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-base font-semibold">{action.title}</h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}