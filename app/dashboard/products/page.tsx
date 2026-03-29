import { ProductsTable } from "@/components/dashboard/tables/products-table"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireDashboardSession,
} from "@/lib/dashboard/session"
import { formatCompactGhanaCedi } from "@/lib/dashboard/format"

type ProductsResponse = {
  products: Array<{
    category?: string | null
    id: string
    isActive: boolean
    name: string
    price: number
    reorderPoint: number
    reorderQuantity?: number | null
    sku?: string | null
    stock: number
    updatedAt: string
  }>
}

export default async function ProductsPage() {
  await requireDashboardSession()

  const { products } = await fetchDashboardApi<ProductsResponse>(
    "/api/admin/products"
  )

  const activeProducts = products.filter((product) => product.isActive)
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.reorderPoint
  )
  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  )

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Product catalog
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Products and pricing.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Product records are loaded from the admin products route and mapped
            directly to the catalog table and inventory statistics.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="carbon-button-secondary cursor-default">
            Read-only view
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="Total catalog records returned by the products API"
          icon="inventory_2"
          title="Total products"
          value={String(products.length)}
        />
        <StatsCard
          caption="Currently active and sellable products"
          icon="check_circle"
          title="Active products"
          value={String(activeProducts.length)}
        />
        <StatsCard
          caption="Products at or below reorder point"
          changeTone="negative"
          icon="warning"
          title="Low stock"
          value={String(lowStockProducts.length)}
        />
        <StatsCard
          caption="Estimated stock value based on current pricing"
          icon="payments"
          title="Inventory value"
          value={formatCompactGhanaCedi(inventoryValue)}
        />
      </section>

      <ProductsTable rows={products} title="Product catalog" />
    </div>
  )
}
