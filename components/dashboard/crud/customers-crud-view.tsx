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
  useAdminCustomersQuery,
  useCreateAdminCustomerMutation,
  useDeleteAdminCustomerMutation,
  useUpdateAdminCustomerMutation,
} from "@/services/customer/customer.query"

type CustomerRow = {
  email?: string | null
  id: string
  isActive: boolean
  lastPurchaseAt?: string | null
  lifetimeValue: number
  name: string
  phone?: string | null
  segment?: string | null
  updatedAt: string
  notes?: string | null
}

type CustomersResponse = {
  ok: true
  customers: CustomerRow[]
}

type CustomerFormState = {
  name: string
  email: string
  phone: string
  segment: string
  notes: string
  isActive: boolean
}

function toCustomerFormState(customer?: CustomerRow): CustomerFormState {
  return {
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    segment: customer?.segment ?? "",
    notes: customer?.notes ?? "",
    isActive: customer?.isActive ?? true,
  }
}

export function CustomersCrudView() {
  const customersQuery = useAdminCustomersQuery()
  const createMutation = useCreateAdminCustomerMutation()
  const deleteMutation = useDeleteAdminCustomerMutation()

  const customers =
    (customersQuery.data as CustomersResponse | undefined)?.customers ?? []

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [editCustomerId, setEditCustomerId] = React.useState<string | null>(
    null
  )

  const [createState, setCreateState] = React.useState<CustomerFormState>(() =>
    toCustomerFormState()
  )
  const [editState, setEditState] = React.useState<CustomerFormState>(() =>
    toCustomerFormState()
  )

  const editCustomer = React.useMemo(
    () => customers.find((customer) => customer.id === editCustomerId) ?? null,
    [customers, editCustomerId]
  )

  const updateMutation = useUpdateAdminCustomerMutation(editCustomerId ?? "")

  React.useEffect(() => {
    if (!editOpen) {
      setEditCustomerId(null)
      return
    }

    if (editCustomer) {
      setEditState(toCustomerFormState(editCustomer))
    }
  }, [editOpen, editCustomer])

  const activeCustomers = customers.filter((customer) => customer.isActive)
  const totalLifetimeValue = customers.reduce(
    (total, customer) => total + customer.lifetimeValue,
    0
  )
  const premiumCustomers = customers.filter(
    (customer) => customer.lifetimeValue >= 1000
  )

  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  async function handleCreateSubmit(event: React.FormEvent) {
    event.preventDefault()

    await createMutation.mutateAsync({
      name: createState.name,
      email: createState.email || undefined,
      phone: createState.phone || undefined,
      segment: createState.segment || undefined,
      notes: createState.notes || undefined,
    })

    setCreateOpen(false)
    setCreateState(toCustomerFormState())
  }

  async function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!editCustomerId) return

    await updateMutation.mutateAsync({
      name: editState.name,
      email: editState.email || undefined,
      phone: editState.phone || undefined,
      segment: editState.segment || undefined,
      notes: editState.notes || undefined,
      isActive: editState.isActive,
    })

    setEditOpen(false)
  }

  async function handleDeactivate(customerId: string, customerName: string) {
    const ok = window.confirm(
      `Deactivate '${customerName}'? Their transaction history will remain available.`
    )

    if (!ok) return

    await deleteMutation.mutateAsync(customerId)
  }

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
            Manage customer records and keep sales history linked.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={<Button className="carbon-button-primary" />}
            >
              <MaterialSymbol className="text-[16px]" icon="person_add" />
              Add customer
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add customer</DialogTitle>
                <DialogDescription>
                  Create a customer profile.
                </DialogDescription>
              </DialogHeader>

              <form className="grid gap-4" onSubmit={handleCreateSubmit}>
                <label className="grid gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Customer name
                  </span>
                  <input
                    className="carbon-input"
                    placeholder="e.g., Ama Mensah"
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
                      Email
                    </span>
                    <input
                      className="carbon-input"
                      inputMode="email"
                      placeholder="Optional"
                      value={createState.email}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Phone
                    </span>
                    <input
                      className="carbon-input"
                      inputMode="tel"
                      placeholder="Optional"
                      value={createState.phone}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Segment
                    </span>
                    <input
                      className="carbon-input"
                      placeholder="e.g., Wholesale"
                      value={createState.segment}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          segment: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Notes
                    </span>
                    <input
                      className="carbon-input"
                      placeholder="Optional"
                      value={createState.notes}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          notes: event.target.value,
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
                      "Add customer"
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
          value={formatGhanaCedi(totalLifetimeValue)}
        />
      </section>

      <section className="border border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Customer directory
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {customersQuery.isLoading ? <Spinner /> : null}
            {customers.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-255 text-left text-sm">
            <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Lifetime value</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last purchase</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customersQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={8}>
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Loading customers…
                    </div>
                  </td>
                </tr>
              ) : customers.length ? (
                customers.map((row) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={row.id}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center border border-border bg-background text-primary">
                          <MaterialSymbol
                            className="text-[16px]"
                            icon="person"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {row.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Updated {formatDashboardDate(row.updatedAt)}
                          </p>
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
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => {
                            setEditCustomerId(row.id)
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
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={8}>
                    No customers yet.
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
            <DialogTitle>Edit customer</DialogTitle>
            <DialogDescription>
              Update customer contact details.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleEditSubmit}>
            <label className="grid gap-2 text-sm text-foreground">
              <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Customer name
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
                  Email
                </span>
                <input
                  className="carbon-input"
                  inputMode="email"
                  value={editState.email}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Phone
                </span>
                <input
                  className="carbon-input"
                  inputMode="tel"
                  value={editState.phone}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Segment
                </span>
                <input
                  className="carbon-input"
                  value={editState.segment}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      segment: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Notes
                </span>
                <input
                  className="carbon-input"
                  value={editState.notes}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={editState.isActive}
                onChange={(event) =>
                  setEditState((prev) => ({
                    ...prev,
                    isActive: event.target.checked,
                  }))
                }
              />
              Active
            </label>

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
