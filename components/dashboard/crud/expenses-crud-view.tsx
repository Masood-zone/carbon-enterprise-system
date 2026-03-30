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
import { formatDashboardDate, formatGhanaCedi } from "@/lib/dashboard/format"
import {
  useAdminExpensesQuery,
  useCreateAdminExpenseMutation,
  useDeleteAdminExpenseMutation,
  useUpdateAdminExpenseMutation,
} from "@/services/expense/expense.query"

type ExpenseRow = {
  amount: number
  category: string
  createdAt: string
  id: string
  notes?: string | null
  occurredAt: string
  title: string
  vendorName?: string | null
}

type ExpensesResponse = {
  ok: true
  expenses: ExpenseRow[]
}

type ExpenseFormState = {
  title: string
  categoryPreset: string
  categoryCustom: string
  amount: string
  vendorName: string
  occurredAt: string
  notes: string
}

const OTHER_CATEGORY_VALUE = "__OTHER__"
const EXPENSE_CATEGORY_OPTIONS = [
  "Rent",
  "Utilities",
  "Transport",
  "Supplies",
  "Salaries",
  "Maintenance",
  "Marketing",
  "Taxes",
] as const

function toExpenseFormState(expense?: ExpenseRow): ExpenseFormState {
  const category = expense?.category ?? ""
  const isPreset = EXPENSE_CATEGORY_OPTIONS.includes(category as never)

  return {
    title: expense?.title ?? "",
    categoryPreset: category
      ? isPreset
        ? category
        : OTHER_CATEGORY_VALUE
      : "",
    categoryCustom: category && !isPreset ? category : "",
    amount: String(expense?.amount ?? 0),
    vendorName: expense?.vendorName ?? "",
    occurredAt: expense?.occurredAt
      ? new Date(expense.occurredAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    notes: expense?.notes ?? "",
  }
}

function normalizeAmount(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function ExpensesCrudView() {
  const expensesQuery = useAdminExpensesQuery()
  const createMutation = useCreateAdminExpenseMutation()
  const deleteMutation = useDeleteAdminExpenseMutation()

  const expenses =
    (expensesQuery.data as ExpensesResponse | undefined)?.expenses ?? []

  const [createOpen, setCreateOpen] = React.useState(false)
  const [editOpen, setEditOpen] = React.useState(false)
  const [editExpenseId, setEditExpenseId] = React.useState<string | null>(null)

  const [createState, setCreateState] = React.useState<ExpenseFormState>(() =>
    toExpenseFormState()
  )
  const [editState, setEditState] = React.useState<ExpenseFormState>(() =>
    toExpenseFormState()
  )

  const editExpense = React.useMemo(
    () => expenses.find((expense) => expense.id === editExpenseId) ?? null,
    [expenses, editExpenseId]
  )

  const updateMutation = useUpdateAdminExpenseMutation(editExpenseId ?? "")

  React.useEffect(() => {
    if (!editOpen) {
      setEditExpenseId(null)
      return
    }

    if (editExpense) {
      setEditState(toExpenseFormState(editExpense))
    }
  }, [editOpen, editExpense])

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )
  const averageExpense = expenses.length ? totalExpenses / expenses.length : 0
  const categoryCount = new Set(expenses.map((expense) => expense.category))
    .size

  const busy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  async function handleCreateSubmit(event: React.FormEvent) {
    event.preventDefault()

    const category =
      createState.categoryPreset === OTHER_CATEGORY_VALUE
        ? createState.categoryCustom.trim()
        : createState.categoryPreset

    if (!category) {
      window.alert("Category is required")
      return
    }

    await createMutation.mutateAsync({
      title: createState.title,
      category,
      amount: normalizeAmount(createState.amount),
      vendorName: createState.vendorName || undefined,
      occurredAt: createState.occurredAt,
      notes: createState.notes || undefined,
    })

    setCreateOpen(false)
    setCreateState(toExpenseFormState())
  }

  async function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!editExpenseId) return

    const category =
      editState.categoryPreset === OTHER_CATEGORY_VALUE
        ? editState.categoryCustom.trim()
        : editState.categoryPreset

    if (!category) {
      window.alert("Category is required")
      return
    }

    await updateMutation.mutateAsync({
      title: editState.title,
      category,
      amount: normalizeAmount(editState.amount),
      vendorName: editState.vendorName || undefined,
      occurredAt: editState.occurredAt,
      notes: editState.notes || undefined,
    })

    setEditOpen(false)
  }

  async function handleDelete(expenseId: string, title: string) {
    const ok = window.confirm(`Delete '${title}'?`)
    if (!ok) return
    await deleteMutation.mutateAsync(expenseId)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            Financial oversight
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            Expenses.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Track and maintain expense records used in financial reporting.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger
              render={<Button className="carbon-button-primary" />}
            >
              <MaterialSymbol className="text-[16px]" icon="add" />
              Add expense
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add expense</DialogTitle>
                <DialogDescription>Enter expense details.</DialogDescription>
              </DialogHeader>

              <form className="grid gap-4" onSubmit={handleCreateSubmit}>
                <label className="grid gap-2 text-sm text-foreground">
                  <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                    Title
                  </span>
                  <input
                    className="carbon-input"
                    required
                    value={createState.title}
                    onChange={(event) =>
                      setCreateState((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Category
                    </span>
                    <Select
                      value={createState.categoryPreset}
                      onValueChange={(value) =>
                        setCreateState((prev) => ({
                          ...prev,
                          categoryPreset: value ?? "",
                          categoryCustom:
                            (value ?? "") === OTHER_CATEGORY_VALUE
                              ? prev.categoryCustom
                              : "",
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select category</SelectItem>
                        {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                        <SelectItem value={OTHER_CATEGORY_VALUE}>
                          Others (please specify)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Amount (GHS)
                    </span>
                    <input
                      className="carbon-input"
                      inputMode="decimal"
                      type="number"
                      required
                      value={createState.amount}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          amount: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                {createState.categoryPreset === OTHER_CATEGORY_VALUE ? (
                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Specify category
                    </span>
                    <input
                      className="carbon-input"
                      required
                      value={createState.categoryCustom}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          categoryCustom: event.target.value,
                        }))
                      }
                    />
                  </label>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Date
                    </span>
                    <input
                      className="carbon-input"
                      type="date"
                      value={createState.occurredAt}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          occurredAt: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="grid gap-2 text-sm text-foreground">
                    <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                      Vendor
                    </span>
                    <input
                      className="carbon-input"
                      placeholder="Optional"
                      value={createState.vendorName}
                      onChange={(event) =>
                        setCreateState((prev) => ({
                          ...prev,
                          vendorName: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

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
                      "Add expense"
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
          caption="All returned expense records"
          icon="request_quote"
          title="Total expenses"
          value={formatGhanaCedi(totalExpenses)}
        />
        <StatsCard
          caption="Average spend per expense record"
          icon="analytics"
          title="Average expense"
          value={formatGhanaCedi(averageExpense)}
        />
        <StatsCard
          caption="Expense categories represented in the dataset"
          icon="category"
          title="Categories"
          value={String(categoryCount)}
        />
        <StatsCard
          caption="Most recent expense date in the dataset"
          icon="schedule"
          title="Latest entry"
          value={
            expenses[0] ? formatDashboardDate(expenses[0].occurredAt) : "-"
          }
        />
      </section>

      <section className="border border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            Expense ledger
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {expensesQuery.isLoading ? <Spinner /> : null}
            {expenses.length} records
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full text-left text-sm">
            <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expensesQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={7}>
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Loading expenses…
                    </div>
                  </td>
                </tr>
              ) : expenses.length ? (
                expenses.map((expense) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={expense.id}
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDashboardDate(expense.occurredAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {expense.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.category}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.vendorName ?? "-"}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatGhanaCedi(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {expense.notes ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => {
                            setEditExpenseId(expense.id)
                            setEditOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busy}
                          onClick={() =>
                            handleDelete(expense.id, expense.title)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={7}>
                    No expenses yet.
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
            <DialogTitle>Edit expense</DialogTitle>
            <DialogDescription>Update the expense entry.</DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleEditSubmit}>
            <label className="grid gap-2 text-sm text-foreground">
              <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Title
              </span>
              <input
                className="carbon-input"
                required
                value={editState.title}
                onChange={(event) =>
                  setEditState((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Category
                </span>
                <Select
                  value={editState.categoryPreset}
                  onValueChange={(value) =>
                    setEditState((prev) => ({
                      ...prev,
                      categoryPreset: value ?? "",
                      categoryCustom:
                        (value ?? "") === OTHER_CATEGORY_VALUE
                          ? prev.categoryCustom
                          : "",
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Select category</SelectItem>
                    {EXPENSE_CATEGORY_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                    <SelectItem value={OTHER_CATEGORY_VALUE}>
                      Others (please specify)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Amount (GHS)
                </span>
                <input
                  className="carbon-input"
                  inputMode="decimal"
                  type="number"
                  required
                  value={editState.amount}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            {editState.categoryPreset === OTHER_CATEGORY_VALUE ? (
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Specify category
                </span>
                <input
                  className="carbon-input"
                  required
                  value={editState.categoryCustom}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      categoryCustom: event.target.value,
                    }))
                  }
                />
              </label>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Date
                </span>
                <input
                  className="carbon-input"
                  type="date"
                  value={editState.occurredAt}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      occurredAt: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Vendor
                </span>
                <input
                  className="carbon-input"
                  value={editState.vendorName}
                  onChange={(event) =>
                    setEditState((prev) => ({
                      ...prev,
                      vendorName: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

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
