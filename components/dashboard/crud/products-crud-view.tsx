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
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  useAdminProductsQuery,
  useCreateAdminProductMutation,
  useDeleteAdminProductMutation,
  useUpdateAdminProductMutation,
} from "@/services/product/product.query"

type ProductRow = {
  category?: string | null
  id: string
  isActive: boolean
  name: string
  price: number
  reorderPoint: number | null
  reorderQuantity?: number | null
  sku?: string | null
  stock: number
  updatedAt: string
}

type ProductsResponse = {
  ok: true
  products: ProductRow[]
}

type ProductFormState = {
  name: string
  category: string
  sku: string
  price: string
  stock: string
  reorderPoint: string
  reorderQuantity: string
  isActive: boolean
}

function toProductFormState(product?: ProductRow): ProductFormState {
  return {
    name: product?.name ?? "",
    category: product?.category ?? "",
    sku: product?.sku ?? "",
    price: String(product?.price ?? 0),
    stock: String(product?.stock ?? 0),
    reorderPoint: String(product?.reorderPoint ?? 0),
    reorderQuantity:
      product?.reorderQuantity === null ||
      product?.reorderQuantity === undefined
        ? ""
        : String(product.reorderQuantity),
    isActive: product?.isActive ?? true,
  }
}

function normalizeNumberInput(value: string) {
  if (!value.trim()) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeOptionalNumberInput(value: string) {
  if (!value.trim()) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function normalizeSkuCategory(value: string) {
  const cleaned = value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "")

  return cleaned || "GENERAL"
}

function generateProductSku(category: string, existingSkus: string[]) {
  const normalizedCategory = normalizeSkuCategory(category)
  const existing = new Set(existingSkus.map((sku) => sku.toUpperCase()))

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const digits = String(Math.floor(Math.random() * 1000)).padStart(3, "0")
    const sku = `GH-${normalizedCategory}-${digits}`
    if (!existing.has(sku)) return sku
  }

  return `GH-${normalizedCategory}-${String(Date.now() % 1000).padStart(3, "0")}`
}

export function ProductsCrudView() {
  const productsQuery = useAdminProductsQuery()
  const createMutation = useCreateAdminProductMutation()
  const deleteMutation = useDeleteAdminProductMutation()

  const products =
    (productsQuery.data as ProductsResponse | undefined)?.products ?? []

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [editProductId, setEditProductId] = React.useState<string | null>(null)

  const [createState, setCreateState] = React.useState<ProductFormState>(() =>
    toProductFormState()
  )
  const [editState, setEditState] = React.useState<ProductFormState>(() =>
    toProductFormState()
  )

  const editProduct = React.useMemo(
    () => products.find((product) => product.id === editProductId) ?? null,
    [products, editProductId]
  )

  const updateMutation = useUpdateAdminProductMutation(editProductId ?? "")

  React.useEffect(() => {
    if (!editOpen) {
      setEditProductId(null)
      return
    }

    if (editProduct) {
      setEditState(toProductFormState(editProduct))
    }
  }, [editOpen, editProduct])

  const activeProducts = products.filter((product) => product.isActive)
  const lowStockProducts = products.filter(
    (product) => product.stock <= (product.reorderPoint ?? 0)
  )
  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  )

  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  async function handleCreateSubmit(event: React.FormEvent) {
    event.preventDefault()

    const existingSkus = products
      .map((product) => product.sku)
      .filter((value): value is string => Boolean(value))
    const sku = createState.sku.trim()
      ? createState.sku
      : generateProductSku(createState.category, existingSkus)

    await createMutation.mutateAsync({
      name: createState.name,
      category: createState.category || undefined,
      sku,
      price: normalizeNumberInput(createState.price),
      stock: Math.trunc(normalizeNumberInput(createState.stock)),
      reorderPoint: Math.trunc(normalizeNumberInput(createState.reorderPoint)),
      reorderQuantity: normalizeOptionalNumberInput(
        createState.reorderQuantity
      ),
      isActive: createState.isActive,
    })

    setCreateOpen(false)
    setCreateState(toProductFormState())
  }

  async function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!editProductId) return

    const existingSkus = products
      .filter((product) => product.id !== editProductId)
      .map((product) => product.sku)
      .filter((value): value is string => Boolean(value))
    const sku = editState.sku.trim()
      ? editState.sku
      : generateProductSku(editState.category, existingSkus)

    await updateMutation.mutateAsync({
      name: editState.name,
      category: editState.category || undefined,
      sku,
      price: normalizeNumberInput(editState.price),
      stock: Math.trunc(normalizeNumberInput(editState.stock)),
      reorderPoint: Math.trunc(normalizeNumberInput(editState.reorderPoint)),
      reorderQuantity: normalizeOptionalNumberInput(editState.reorderQuantity),
      isActive: editState.isActive,
    })

    setEditOpen(false)
  }

  async function handleDeactivate(productId: string, productName: string) {
    const ok = window.confirm(
      `Deactivate '${productName}'? This keeps history but removes it from active catalogs.`
    )

    if (!ok) return

    await deleteMutation.mutateAsync(productId)
  }

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
            Create, update, and deactivate products. Deactivation preserves
            linked transactions and stock movement history.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={<Button className="carbon-button-primary" />}
            >
              <MaterialSymbol className="text-[16px]" icon="add" />
              Add product
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add product</DialogTitle>
                <DialogDescription>
                  Enter details for the new inventory item.
                </DialogDescription>
              </DialogHeader>

              <form className="grid gap-4" onSubmit={handleCreateSubmit}>
                <label className="grid gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Product name
                  </span>
                  <input
                    className="carbon-input"
                    placeholder="e.g., Premium Palm Oil 5L"
                    required
                    value={createState.name}
                    onChange={(event) =>
                      setCreateState((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Category
                    </span>
                    <input
                      className="carbon-input"
                      placeholder="e.g., Beverages"
                      value={createState.category}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          category: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      SKU
                    </span>
                    <input
                      className="carbon-input"
                      placeholder="Optional"
                      value={createState.sku}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          sku: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Price (GHS)
                    </span>
                    <input
                      className="carbon-input"
                      inputMode="decimal"
                      type="number"
                      value={createState.price}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          price: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Initial stock level
                    </span>
                    <input
                      className="carbon-input"
                      inputMode="numeric"
                      type="number"
                      value={createState.stock}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          stock: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Reorder point
                    </span>
                    <input
                      className="carbon-input"
                      inputMode="numeric"
                      type="number"
                      value={createState.reorderPoint}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          reorderPoint: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Reorder quantity
                    </span>
                    <input
                      className="carbon-input"
                      inputMode="numeric"
                      type="number"
                      placeholder="Optional"
                      value={createState.reorderQuantity}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          reorderQuantity: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    disabled={busy}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={busy}>
                    {createMutation.isPending ? (
                      <>
                        <Spinner />
                        Adding
                      </>
                    ) : (
                      "Add product"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
          value={formatGhanaCedi(inventoryValue)}
        />
      </section>

      <section className="border border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Product catalog
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {productsQuery.isLoading ? <Spinner /> : null}
            {products.length} items
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-245 text-left text-sm">
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
              {productsQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={8}>
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Loading products…
                    </div>
                  </td>
                </tr>
              ) : products.length ? (
                products.map((row) => {
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
                                : row.isActive
                                  ? "Catalog item"
                                  : "Deactivated"}
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
                            !row.isActive &&
                              "border-border bg-muted text-muted-foreground",
                            row.isActive &&
                              statusTone === "success" &&
                              "border-emerald-200 bg-emerald-50 text-emerald-700",
                            row.isActive &&
                              statusTone === "warning" &&
                              "border-amber-200 bg-amber-50 text-amber-700",
                            row.isActive &&
                              statusTone === "danger" &&
                              "border-red-200 bg-red-50 text-red-700"
                          )}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {!row.isActive
                            ? "Inactive"
                            : statusTone === "success"
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
                        <div className="inline-flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => {
                              setEditProductId(row.id)
                              setEditOpen(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={busy || !row.isActive}
                            onClick={() => handleDeactivate(row.id, row.name)}
                          >
                            Deactivate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={8}>
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
            <DialogDescription>
              Update product details and stock.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleEditSubmit}>
            <label className="grid gap-2 text-sm text-foreground">
              <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Product name
              </span>
              <input
                className="carbon-input"
                required
                value={editState.name}
                onChange={(event) =>
                  setEditState((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Category
                </span>
                <input
                  className="carbon-input"
                  value={editState.category}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  SKU
                </span>
                <input
                  className="carbon-input"
                  value={editState.sku}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      sku: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Price (GHS)
                </span>
                <input
                  className="carbon-input"
                  inputMode="decimal"
                  type="number"
                  value={editState.price}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Stock
                </span>
                <input
                  className="carbon-input"
                  inputMode="numeric"
                  type="number"
                  value={editState.stock}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      stock: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Reorder point
                </span>
                <input
                  className="carbon-input"
                  inputMode="numeric"
                  type="number"
                  value={editState.reorderPoint}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      reorderPoint: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Reorder quantity
                </span>
                <input
                  className="carbon-input"
                  inputMode="numeric"
                  type="number"
                  value={editState.reorderQuantity}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      reorderQuantity: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {updateMutation.isPending ? (
                  <>
                    <Spinner />
                    Saving
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
