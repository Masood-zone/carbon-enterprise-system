import { CustomersTable } from "@/components/dashboard/tables/customers-table"
import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireDashboardSession,
} from "@/lib/dashboard/session"
import { formatCompactGhanaCedi } from "@/lib/dashboard/format"

type CustomersResponse = {
  customers: Array<{
    email?: string | null
    id: string
    isActive: boolean
    lastPurchaseAt?: string | null
    lifetimeValue: number
    name: string
    phone?: string | null
    segment?: string | null
    updatedAt: string
  }>
}

export default async function CustomersPage() {
  await requireDashboardSession()

  const { customers } = await fetchDashboardApi<CustomersResponse>(
    "/api/admin/customers"
  )

  const activeCustomers = customers.filter((customer) => customer.isActive)
  const totalLifetimeValue = customers.reduce(
    (total, customer) => total + customer.lifetimeValue,
    0
  )
  const premiumCustomers = customers.filter(
    (customer) => customer.lifetimeValue >= 1000
  )
  const recentCustomers = customers
    .filter((customer) => customer.lastPurchaseAt)
    .sort((left, right) => {
      const leftDate = new Date(left.lastPurchaseAt ?? 0).getTime()
      const rightDate = new Date(right.lastPurchaseAt ?? 0).getTime()
      return rightDate - leftDate
    })

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Customer intelligence
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Customers.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Customer records are mapped from the admin customer route with their
            lifetime value and activity status intact.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="Total customer records in the current business"
          icon="groups"
          title="Customers"
          value={String(customers.length)}
        />
        <StatsCard
          caption="Customer records marked active"
          icon="check_circle"
          title="Active"
          value={String(activeCustomers.length)}
        />
        <StatsCard
          caption="Customers with a lifetime value above GHS 1,000"
          icon="star"
          title="Premium"
          value={String(premiumCustomers.length)}
        />
        <StatsCard
          caption="Combined lifetime value across all customers"
          icon="payments"
          title="Lifetime value"
          value={formatCompactGhanaCedi(totalLifetimeValue)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <CustomersTable rows={customers} title="Customer directory" />
        <ActivityFeed
          items={recentCustomers.slice(0, 5).map((customer) => ({
            description: `${customer.segment ?? "General"} · ${formatCompactGhanaCedi(customer.lifetimeValue)}`,
            icon: "person",
            meta: customer.lastPurchaseAt ?? customer.updatedAt,
            title: customer.name,
            tone: customer.isActive ? "success" : "default",
          }))}
          title="Recent customer value"
        />
      </section>
    </div>
  )
}
