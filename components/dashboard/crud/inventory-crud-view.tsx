"use client"

import * as React from "react"

import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  useAdminInventoryQuery,
  useAdminLowStockQuery,
  useCreateInventoryMovementMutation,
} from "@/services/product/product.query"

type InventoryRow = {
  category?: string | null
  costPrice?: number | null
  id: string
  isActive: boolean
  name: string
  price: number
  reorderPoint: number
  reorderQuantity?: number | null
  reservedStock: number
  safetyStock: number
  sku?: string | null
  stock: number
  updatedAt: string
}

type InventoryResponse = { ok: true; inventory: InventoryRow[] }

type LowStockResponse = {
  ok: true
  threshold: number
  lowStock: Array<{
    id: string
    name: string
    reorderPoint: number
    sku?: string | null
    stock: number
  }>
}

type MovementFormState = {
  movementType: string
  quantity: string
  notes: string
}

function toMovementFormState(): MovementFormState {
  return {
    movementType: "ADJUSTMENT",
    quantity: "0",
    notes: "",
  }
}

function normalizeQuantity(value: string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 0
  return Math.trunc(parsed)
}

export function InventoryCrudView() {
  const inventoryQuery = useAdminInventoryQuery()
  const lowStockQuery = useAdminLowStockQuery()
  const movementMutation = useCreateInventoryMovementMutation()

  const inventory =
    (inventoryQuery.data as InventoryResponse | undefined)?.inventory ?? []
  const lowStockPayload =
    (lowStockQuery.data as LowStockResponse | undefined) ?? null
  const lowStock = lowStockPayload?.lowStock ?? []
  const threshold = lowStockPayload?.threshold ?? 10

  const reservedUnits = inventory.reduce(
    (total, product) => total + product.reservedStock,
    0
  )
  const inventoryValue = inventory.reduce(
    (total, product) => total + product.price * product.stock,
    0
  )

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [movementState, setMovementState] = React.useState<MovementFormState>(
    () => toMovementFormState()
  )
  const [selectedProduct, setSelectedProduct] =
    React.useState<InventoryRow | null>(null)

  const busy = movementMutation.isPending

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!selectedProduct) return

    const quantity = normalizeQuantity(movementState.quantity)

    await movementMutation.mutateAsync({
      productId: selectedProduct.id,
      movementType: movementState.movementType,
      quantity,
      notes: movementState.notes || undefined,
    })

    setDialogOpen(false)
    setSelectedProduct(null)
    setMovementState(toMovementFormState())
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Inventory control
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Stock and replenishment.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Record manual stock movements (adjustments, counts, write-offs) and
            keep the movement ledger consistent.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="Total catalog items in inventory scope"
          icon="warehouse"
          title="Tracked items"
          value={String(inventory.length)}
        />
        <StatsCard
          caption={`Items currently below the low-stock threshold (${threshold})`}
          changeTone="negative"
          icon="warning"
          title="Low stock"
          value={String(lowStock.length)}
        />
        <StatsCard
          caption="Units reserved against future transactions"
          icon="inventory"
          title="Reserved units"
          value={String(reservedUnits)}
        />
        <StatsCard
          caption="Current stock valuation at catalog prices"
          icon="payments"
          title="Stock value"
          value={formatGhanaCedi(inventoryValue)}
        />
      </section>

      <section className="border border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Inventory snapshot
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {inventoryQuery.isLoading ? <Spinner /> : null}
            {inventory.length} items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-275 text-left text-sm">
            <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={8}>
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Loading inventory…
                    </div>
                  </td>
                </tr>
              ) : inventory.length ? (
                inventory.map((row) => {
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
                              Reserved{" "}
                              {row.reservedStock.toLocaleString("en-GH")}
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
                      <td className="px-4 py-3 text-right">
                        <Dialog
                          open={dialogOpen && selectedProduct?.id === row.id}
                          onOpenChange={(open) => {
                            setDialogOpen(open)
                            if (open) {
                              setSelectedProduct(row)
                              setMovementState(toMovementFormState())
                            } else if (selectedProduct?.id === row.id) {
                              setSelectedProduct(null)
                            }
                          }}
                        >
                          <DialogTrigger
                            render={
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={busy}
                              />
                            }
                          >
                            Adjust
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Adjust stock</DialogTitle>
                              <DialogDescription>
                                Record a stock movement for {row.name}.
                              </DialogDescription>
                            </DialogHeader>

                            <form
                              className="grid gap-4"
                              onSubmit={handleSubmit}
                            >
                              <label className="grid gap-2 text-sm text-foreground">
                                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                                  Movement type
                                </span>
                                <Select
                                  value={movementState.movementType}
                                  onValueChange={(value) =>
                                    setMovementState((prev) => ({
                                      ...prev,
                                      movementType: value ?? prev.movementType,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ADJUSTMENT">
                                      Adjustment
                                    </SelectItem>
                                    <SelectItem value="COUNT">Count</SelectItem>
                                    <SelectItem value="WRITE_OFF">
                                      Write-off
                                    </SelectItem>
                                    <SelectItem value="RETURN">
                                      Return
                                    </SelectItem>
                                    <SelectItem value="PURCHASE">
                                      Purchase
                                    </SelectItem>
                                    <SelectItem value="TRANSFER">
                                      Transfer
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </label>

                              <label className="grid gap-2 text-sm text-foreground">
                                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                                  Quantity
                                </span>
                                <input
                                  className="carbon-input"
                                  inputMode="numeric"
                                  type="number"
                                  value={movementState.quantity}
                                  onChange={(event) =>
                                    setMovementState((prev) => ({
                                      ...prev,
                                      quantity: event.target.value,
                                    }))
                                  }
                                />
                                <p className="text-xs text-muted-foreground">
                                  Use negative numbers to reduce stock.
                                </p>
                              </label>

                              <label className="grid gap-2 text-sm text-foreground">
                                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                                  Notes
                                </span>
                                <input
                                  className="carbon-input"
                                  placeholder="Optional"
                                  value={movementState.notes}
                                  onChange={(event) =>
                                    setMovementState((prev) => ({
                                      ...prev,
                                      notes: event.target.value,
                                    }))
                                  }
                                />
                              </label>

                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  type="button"
                                  onClick={() => setDialogOpen(false)}
                                  disabled={busy}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={busy}>
                                  {movementMutation.isPending ? (
                                    <>
                                      <Spinner />
                                      Saving
                                    </>
                                  ) : (
                                    "Record movement"
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={8}>
                    No inventory records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
