import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { cn } from "@/lib/utils"
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"

export type TransactionTableRow = {
  customer?: { name?: string | null } | null
  id: string
  items?: Array<{ id?: string }>
  paymentMethod?: string | null
  soldAt: string | Date
  soldBy?: { name?: string | null } | null
  status: string
  totalAmount: number
  transactionNumber?: string | null
  reference?: string | null
}

export function TransactionsTable({
  rows,
  title = "Transactions",
}: {
  rows: TransactionTableRow[]
  title?: string
}) {
  return (
    <section className="border border-border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{rows.length} records</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-245 text-left text-sm">
          <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sold by</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const statusTone =
                row.status.toUpperCase() === "COMPLETED"
                  ? "success"
                  : row.status.toUpperCase() === "PENDING"
                    ? "warning"
                    : row.status.toUpperCase() === "REFUNDED"
                      ? "neutral"
                      : "danger"

              return (
                <tr
                  className="border-b border-border last:border-b-0"
                  key={row.id}
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDashboardDate(row.soldAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    {row.transactionNumber ?? row.reference ?? row.id}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {row.customer?.name ?? "Walk-in customer"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.items?.length ?? 0} line items
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {formatGhanaCedi(row.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 border px-2 py-1 text-[11px] font-medium tracking-[0.18em] uppercase",
                        statusTone === "success" &&
                          "border-emerald-200 bg-emerald-50 text-emerald-700",
                        statusTone === "warning" &&
                          "border-amber-200 bg-amber-50 text-amber-700",
                        statusTone === "neutral" &&
                          "border-border bg-muted text-muted-foreground",
                        statusTone === "danger" &&
                          "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.soldBy?.name ?? "System"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
