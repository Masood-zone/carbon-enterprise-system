import { ProductsTable } from "@/components/dashboard/tables/products-table"
import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireDashboardSession,
} from "@/lib/dashboard/session"
import { formatCompactGhanaCedi } from "@/lib/dashboard/format"

type InventoryResponse = {
  inventory: Array<{
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
  }>
}

type LowStockResponse = {
  lowStock: Array<{
    id: string
    name: string
    reorderPoint: number
    sku?: string | null
    stock: number
  }>
  threshold: number
}

export default async function InventoryPage() {
  await requireDashboardSession()

  const [{ inventory }, { lowStock, threshold }] = await Promise.all([
    fetchDashboardApi<InventoryResponse>("/api/admin/inventory"),
    fetchDashboardApi<LowStockResponse>("/api/admin/inventory/low-stock"),
  ])

  const reservedUnits = inventory.reduce(
    (total, product) => total + product.reservedStock,
    0
  )
  const inventoryValue = inventory.reduce(
    (total, product) => total + product.price * product.stock,
    0
  )

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
            Inventory items are sourced from the inventory route and paired with
            live low-stock data for the configured threshold of {threshold}.
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
          caption="Items currently below the low-stock threshold"
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
          value={formatCompactGhanaCedi(inventoryValue)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <ProductsTable rows={inventory} title="Inventory snapshot" />

        <ActivityFeed
          items={lowStock.slice(0, 5).map((product) => ({
            description: `Current stock ${product.stock} against reorder point ${product.reorderPoint}`,
            icon: "inventory_2",
            meta: product.sku ?? product.id,
            title: product.name,
            tone: "warning" as const,
          }))}
          title="Restock queue"
        />
      </section>
    </div>
  )
}
