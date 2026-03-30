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
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import { cn } from "@/lib/utils"
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"
import { useAdminCustomersQuery } from "@/services/customer/customer.query"
import { useAdminProductsQuery } from "@/services/product/product.query"
import {
  useAdminTransactionsQuery,
  useCreateAdminTransactionMutation,
  useVoidAdminTransactionMutation,
} from "@/services/transaction/transaction.query"

type TransactionRow = {
  customer?: { name?: string | null } | null
  id: string
  items: Array<{
    id: string
    product?: { name?: string | null } | null
    quantity: number
  }>
  soldAt: string
  soldBy?: { name?: string | null } | null
  status: string
  totalAmount: number
  transactionNumber?: string | null
  reference?: string | null
}

type TransactionsResponse = { ok: true; transactions: TransactionRow[] }

type ProductRow = {
  id: string
  name: string
  isActive: boolean
  stock: number
  price: number
}

type ProductsResponse = { ok: true; products: ProductRow[] }

type CustomerRow = { id: string; name?: string | null; isActive: boolean }

type CustomersResponse = { ok: true; customers: CustomerRow[] }

type LineItemState = {
  productId: string
  quantity: string
  price: string
  discountAmount: string
}

type TransactionFormState = {
  customerId: string
  paymentMethod: string
  reference: string
  status: string
  transactionNumber: string
  items: LineItemState[]
}

function generateTransactionNumber(existing: TransactionRow[]) {
  const existingNumbers = new Set(
    existing
      .map((row) => row.transactionNumber)
      .filter((value): value is string => Boolean(value))
  )

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const digits = String(Math.floor(Math.random() * 100000)).padStart(5, "0")
    const trx = `TRX-${digits}`
    if (!existingNumbers.has(trx)) return trx
  }

  return `TRX-${String(Date.now() % 100000).padStart(5, "0")}`
}

function emptyLineItem(): LineItemState {
  return {
    productId: "",
    quantity: "1",
    price: "",
    discountAmount: "0",
  }
}

function emptyFormState(): TransactionFormState {
  return {
    customerId: "",
    paymentMethod: "",
    reference: "",
    status: "COMPLETED",
    transactionNumber: "",
    items: [emptyLineItem()],
  }
}

function asNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function asInt(value: string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return undefined
  return Math.trunc(parsed)
}

export function TransactionsCrudView() {
  const transactionsQuery = useAdminTransactionsQuery()
  const productsQuery = useAdminProductsQuery()
  const customersQuery = useAdminCustomersQuery()

  const createMutation = useCreateAdminTransactionMutation()
  const voidMutation = useVoidAdminTransactionMutation()

  const transactions =
    (transactionsQuery.data as TransactionsResponse | undefined)
      ?.transactions ?? []
  const products =
    (productsQuery.data as ProductsResponse | undefined)?.products ?? []
  const customers =
    (customersQuery.data as CustomersResponse | undefined)?.customers ?? []

  const totalRevenue = transactions.reduce(
    (total, transaction) => total + transaction.totalAmount,
    0
  )
  const completed = transactions.filter(
    (transaction) => transaction.status.toUpperCase() === "COMPLETED"
  )
  const pending = transactions.filter(
    (transaction) => transaction.status.toUpperCase() === "PENDING"
  )
  const totalItems = transactions.reduce(
    (total, transaction) => total + transaction.items.length,
    0
  )

  const [newDialogOpen, setNewDialogOpen] = React.useState(false)
  const [formState, setFormState] = React.useState<TransactionFormState>(() =>
    emptyFormState()
  )

  React.useEffect(() => {
    if (!newDialogOpen) return

    setFormState((prev) => {
      if (prev.transactionNumber.trim()) return prev
      return {
        ...prev,
        transactionNumber: generateTransactionNumber(transactions),
      }
    })
  }, [newDialogOpen, transactions])

  const busy =
    createMutation.isPending ||
    voidMutation.isPending ||
    transactionsQuery.isLoading

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault()

    const normalizedItems = formState.items
      .filter((item) => Boolean(item.productId))
      .map((item) => ({
        productId: item.productId,
        quantity: asInt(item.quantity) ?? Number.NaN,
        price: item.price.trim() ? asNumber(item.price) : undefined,
        discountAmount: item.discountAmount.trim()
          ? asNumber(item.discountAmount)
          : undefined,
      }))

    const transactionNumber = formState.transactionNumber.trim()
      ? formState.transactionNumber
      : generateTransactionNumber(transactions)

    await createMutation.mutateAsync({
      customerId: formState.customerId.trim()
        ? formState.customerId
        : undefined,
      items: normalizedItems,
      paymentMethod: formState.paymentMethod.trim()
        ? formState.paymentMethod
        : undefined,
      reference: formState.reference.trim() ? formState.reference : undefined,
      status: formState.status,
      transactionNumber,
    })

    setNewDialogOpen(false)
    setFormState(emptyFormState())
  }

  async function handleVoid(transactionId: string) {
    const confirmed = window.confirm(
      "Void this transaction? Stock will be restored."
    )
    if (!confirmed) return

    await voidMutation.mutateAsync(transactionId)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Sales operations
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Transactions.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Create sales transactions and void incorrect entries while keeping
            stock movements consistent.
          </p>
        </div>

        <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
          <DialogTrigger render={<Button disabled={busy} />}>
            New transaction
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>New transaction</DialogTitle>
              <DialogDescription>
                Add line items, then record the sale.
              </DialogDescription>
            </DialogHeader>

            <form className="grid gap-4" onSubmit={handleCreate}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Customer
                  </span>
                  <Select
                    value={formState.customerId}
                    onValueChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        customerId: value ?? "",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Walk-in customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Walk-in customer</SelectItem>
                      {customers
                        .filter((customer) => customer.isActive)
                        .map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name ?? customer.id}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </label>

                <label className="grid gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Status
                  </span>
                  <Select
                    value={formState.status}
                    onValueChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        status: value ?? "COMPLETED",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="grid gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Payment method
                  </span>
                  <Select
                    value={formState.paymentMethod}
                    onValueChange={(value) =>
                      setFormState((prev) => ({
                        ...prev,
                        paymentMethod: value ?? "",
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select method</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
                      <SelectItem value="BANK">Bank</SelectItem>
                      <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </label>

                <label className="grid gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Reference
                  </span>
                  <input
                    className="carbon-input"
                    placeholder="Optional"
                    value={formState.reference}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        reference: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="grid gap-2 text-sm text-foreground md:col-span-2">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Transaction number
                  </span>
                  <input
                    className="carbon-input"
                    placeholder="Optional"
                    value={formState.transactionNumber}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        transactionNumber: event.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated as TRX-00000 if left blank.
                  </p>
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Line items
                  </p>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        items: [...prev.items, emptyLineItem()],
                      }))
                    }
                    disabled={busy}
                  >
                    Add item
                  </Button>
                </div>

                <div className="grid gap-3">
                  {formState.items.map((item, index) => (
                    <div
                      className="grid gap-3 rounded border border-border bg-background p-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)_minmax(0,0.6fr)_minmax(0,0.6fr)_auto]"
                      key={index}
                    >
                      <label className="grid gap-2 text-sm text-foreground">
                        <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                          Product
                        </span>
                        <Select
                          value={item.productId}
                          onValueChange={(value) =>
                            setFormState((prev) => ({
                              ...prev,
                              items: prev.items.map((row, rowIndex) =>
                                rowIndex === index
                                  ? { ...row, productId: value ?? "" }
                                  : row
                              ),
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products
                              .filter((product) => product.isActive)
                              .map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} (stock {product.stock})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </label>

                      <label className="grid gap-2 text-sm text-foreground">
                        <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                          Qty
                        </span>
                        <input
                          className="carbon-input"
                          inputMode="numeric"
                          min={1}
                          type="number"
                          value={item.quantity}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              items: prev.items.map((row, rowIndex) =>
                                rowIndex === index
                                  ? { ...row, quantity: event.target.value }
                                  : row
                              ),
                            }))
                          }
                        />
                      </label>

                      <label className="grid gap-2 text-sm text-foreground">
                        <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                          Price
                        </span>
                        <input
                          className="carbon-input"
                          inputMode="decimal"
                          min={0}
                          type="number"
                          value={item.price}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              items: prev.items.map((row, rowIndex) =>
                                rowIndex === index
                                  ? { ...row, price: event.target.value }
                                  : row
                              ),
                            }))
                          }
                        />
                      </label>

                      <label className="grid gap-2 text-sm text-foreground">
                        <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                          Discount
                        </span>
                        <input
                          className="carbon-input"
                          inputMode="decimal"
                          min={0}
                          type="number"
                          value={item.discountAmount}
                          onChange={(event) =>
                            setFormState((prev) => ({
                              ...prev,
                              items: prev.items.map((row, rowIndex) =>
                                rowIndex === index
                                  ? {
                                      ...row,
                                      discountAmount: event.target.value,
                                    }
                                  : row
                              ),
                            }))
                          }
                        />
                      </label>

                      <div className="flex items-end justify-end">
                        <Button
                          size="icon"
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setFormState((prev) => ({
                              ...prev,
                              items: prev.items.filter(
                                (_, rowIndex) => rowIndex !== index
                              ),
                            }))
                          }
                          disabled={busy || formState.items.length === 1}
                          title="Remove line"
                        >
                          <MaterialSymbol icon="close" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setNewDialogOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {createMutation.isPending ? (
                    <>
                      <Spinner />
                      Saving
                    </>
                  ) : (
                    "Record sale"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          caption="Gross value of all returned sales records"
          icon="payments"
          title="Revenue"
          value={formatGhanaCedi(totalRevenue)}
        />
        <StatsCard
          caption="Transactions with completed status"
          icon="check_circle"
          title="Completed"
          value={String(completed.length)}
        />
        <StatsCard
          caption="Transactions still awaiting completion"
          changeTone="neutral"
          icon="hourglass_empty"
          title="Pending"
          value={String(pending.length)}
        />
        <StatsCard
          caption="Total line items sold across the current dataset"
          icon="inventory_2"
          title="Line items"
          value={String(totalItems)}
        />
      </section>

      <section className="border border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Sales transactions
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {transactionsQuery.isLoading ? <Spinner /> : null}
            {transactions.length} rows
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-275 text-left text-sm">
            <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sold at</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactionsQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={7}>
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Loading transactions…
                    </div>
                  </td>
                </tr>
              ) : transactions.length ? (
                transactions.map((row) => {
                  const status = row.status.toUpperCase()
                  const isVoided = status === "VOIDED"

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
                              icon="receipt_long"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {row.transactionNumber ?? row.reference ?? row.id}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {row.soldBy?.name ?? "System"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.customer?.name ?? "Walk-in"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.items.length.toLocaleString("en-GH")}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {formatGhanaCedi(row.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 border px-2 py-1 text-[11px] font-medium tracking-[0.18em] uppercase",
                            status === "COMPLETED" &&
                              "border-emerald-200 bg-emerald-50 text-emerald-700",
                            status === "PENDING" &&
                              "border-amber-200 bg-amber-50 text-amber-700",
                            status === "VOIDED" &&
                              "border-red-200 bg-red-50 text-red-700",
                            !["COMPLETED", "PENDING", "VOIDED"].includes(
                              status
                            ) &&
                              "border-border bg-background text-muted-foreground"
                          )}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDashboardDate(row.soldAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVoid(row.id)}
                          disabled={busy || isVoided}
                        >
                          Void
                        </Button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={7}>
                    No transactions yet.
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
