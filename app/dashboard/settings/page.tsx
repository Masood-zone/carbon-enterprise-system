import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import { DashboardSettingsForm } from "@/components/dashboard/settings/settings-form"
import {
  fetchDashboardApi,
  requireAdminDashboardSession,
} from "@/lib/dashboard/session"
import { formatDashboardDateTime } from "@/lib/dashboard/format"

type SettingsResponse = {
  business: {
    currency: string
    id: string
    location: string
    name: string
    phone?: string | null
    settings?: {
      adaptiveInsightsEnabled: boolean
      analyticsWindowDays: number
      autoReorderEnabled: boolean
      forecastHorizonDays?: number
      lowStockThreshold: number
      overstockAlertThreshold: number
      reorderReviewIntervalDays: number
      stockoutAlertThreshold: number
      updatedAt: string
    } | null
    status: string
    taxRate?: number | null
    timezone: string
    type: string
    users: Array<{ id: string; name: string; role: string }>
  }
  settings: {
    adaptiveInsightsEnabled: boolean
    analyticsWindowDays: number
    autoReorderEnabled: boolean
    dashboardDefaults?: unknown
    lowStockThreshold: number
    overstockAlertThreshold: number
    reorderReviewIntervalDays: number
    stockoutAlertThreshold: number
    updatedAt: string
  } | null
}

export default async function SettingsPage() {
  await requireAdminDashboardSession()

  const { business, settings } = await fetchDashboardApi<SettingsResponse>(
    "/api/admin/settings"
  )

  const resolvedSettings = settings ?? business.settings
  const initialValues = {
    adaptiveInsightsEnabled: resolvedSettings?.adaptiveInsightsEnabled ?? true,
    analyticsWindowDays: resolvedSettings?.analyticsWindowDays ?? 90,
    autoReorderEnabled: resolvedSettings?.autoReorderEnabled ?? false,
    lowStockThreshold: resolvedSettings?.lowStockThreshold ?? 10,
    overstockAlertThreshold: resolvedSettings?.overstockAlertThreshold ?? 90,
    reorderReviewIntervalDays: resolvedSettings?.reorderReviewIntervalDays ?? 7,
    stockoutAlertThreshold: resolvedSettings?.stockoutAlertThreshold ?? 3,
  }

  return (
    <div className="space-y-6">
      <section className="border border-border bg-card p-6 text-card-foreground">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
          Business configuration
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Settings.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Business and platform settings are read from the admin settings route
          so administrators can review the live configuration.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard icon="business" title="Business" value={business.name} />
        <StatsCard
          icon="location_on"
          title="Location"
          value={business.location}
        />
        <StatsCard icon="payments" title="Currency" value={business.currency} />
        <StatsCard
          icon="people"
          title="Users"
          value={String(business.users.length)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-card p-4 text-card-foreground">
          <h2 className="text-base font-semibold text-foreground">
            Business profile
          </h2>
          <div className="mt-4 grid gap-3 text-sm">
            <Row label="Business ID" value={business.id} />
            <Row label="Type" value={business.type} />
            <Row label="Status" value={business.status} />
            <Row label="Timezone" value={business.timezone} />
            <Row
              label="Tax rate"
              value={
                business.taxRate === null ? "Not set" : `${business.taxRate}%`
              }
            />
            <Row label="Phone" value={business.phone ?? "-"} />
            <Row
              label="Last settings update"
              value={
                resolvedSettings
                  ? formatDashboardDateTime(resolvedSettings.updatedAt)
                  : "-"
              }
            />
          </div>
        </div>

        <DashboardSettingsForm
          initialValues={initialValues}
          lastUpdatedLabel={
            resolvedSettings
              ? formatDashboardDateTime(resolvedSettings.updatedAt)
              : undefined
          }
        />
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border bg-background px-3 py-2">
      <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}
