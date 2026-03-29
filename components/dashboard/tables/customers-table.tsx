import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { cn } from "@/lib/utils"
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"

export type CustomerTableRow = {
  email?: string | null
  id: string
  isActive: boolean
  lastPurchaseAt?: string | Date | null
  lifetimeValue: number
  name: string
  phone?: string | null
  segment?: string | null
  updatedAt?: string | Date
}

export function CustomersTable({
  rows,
  title = "Customers",
}: {
  rows: CustomerTableRow[]
  title?: string
}) {
  return (
    <section className="border border-border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{rows.length} records</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Segment</th>
              <th className="px-4 py-3">Lifetime value</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last purchase</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                className="border-b border-border last:border-b-0"
                key={row.id}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center border border-border bg-background text-primary">
                      <MaterialSymbol className="text-[16px]" icon="person" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{row.name}</p>
                      {row.updatedAt ? (
                        <p className="text-xs text-muted-foreground">
                          Updated {formatDashboardDate(row.updatedAt)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.email ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.phone ?? "-"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.segment ?? "General"}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {formatGhanaCedi(row.lifetimeValue)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 border px-2 py-1 text-[11px] font-medium tracking-[0.18em] uppercase",
                      row.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-border bg-muted text-muted-foreground"
                    )}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {row.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.lastPurchaseAt
                    ? formatDashboardDate(row.lastPurchaseAt)
                    : "No purchases yet"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
