import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { cn } from "@/lib/utils"
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"

export type ProductTableRow = {
  category?: string | null
  id: string
  isActive: boolean
  name: string
  price: number
  reorderPoint: number | null
  reorderQuantity?: number | null
  sku?: string | null
  stock: number
  updatedAt: string | Date
}

export function ProductsTable({
  rows,
  title = "Products",
}: {
  rows: ProductTableRow[]
  title?: string
}) {
  return (
    <section className="border border-border bg-card text-card-foreground">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{rows.length} items</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left text-sm">
          <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const statusTone =
                row.stock <= 0
                  ? "danger"
                  : row.stock <= (row.reorderPoint ?? 0)
                    ? "warning"
                    : "success"

              return (
                <tr
                  className="border-b border-border last:border-b-0"
                  key={row.id}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center border border-border bg-background text-primary">
                        <MaterialSymbol
                          className="text-[16px]"
                          icon="inventory_2"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {row.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.reorderQuantity !== undefined &&
                          row.reorderQuantity !== null
                            ? `Reorder qty ${row.reorderQuantity}`
                            : "Catalog item"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.sku ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.category ?? "Uncategorized"}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {formatGhanaCedi(row.price)}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {row.stock.toLocaleString("en-GH")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 border px-2 py-1 text-[11px] font-medium tracking-[0.18em] uppercase",
                        statusTone === "success" &&
                          "border-emerald-200 bg-emerald-50 text-emerald-700",
                        statusTone === "warning" &&
                          "border-amber-200 bg-amber-50 text-amber-700",
                        statusTone === "danger" &&
                          "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      {statusTone === "success"
                        ? "In stock"
                        : statusTone === "warning"
                          ? "Low stock"
                          : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDashboardDate(row.updatedAt)}
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
