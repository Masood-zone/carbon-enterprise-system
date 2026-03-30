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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { formatDashboardDateTime } from "@/lib/dashboard/format"
import {
  useAdminUsersQuery,
  useCreateAdminUserMutation,
  useDeleteAdminUserMutation,
  useUpdateAdminUserMutation,
} from "@/services/user/user.query"

type UserRole = "ADMIN" | "MANAGER"

type UserRow = {
  createdAt: string
  email: string
  emailVerified: boolean
  id: string
  image?: string | null
  lastActiveAt?: string | null
  name: string
  role: UserRole
  updatedAt: string
}

type UsersResponse = {
  ok: true
  users: UserRow[]
}

type StatusFilter = "ALL" | "ACTIVE" | "PENDING"

type RoleFilter = "ALL" | UserRole

type UserCreateState = {
  name: string
  email: string
  password: string
  role: UserRole
}

type UserEditState = {
  name: string
  email: string
  role: UserRole
}

function toCreateState(): UserCreateState {
  return {
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
  }
}

function toEditState(user: UserRow): UserEditState {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function matchesStatus(user: UserRow, filter: StatusFilter) {
  if (filter === "ALL") return true
  if (filter === "ACTIVE") return user.emailVerified
  return !user.emailVerified
}

function progressWidthClass(numerator: number, denominator: number) {
  if (!denominator) return "w-0"

  const ratio = numerator / denominator

  if (ratio >= 0.875) return "w-full"
  if (ratio >= 0.625) return "w-3/4"
  if (ratio >= 0.375) return "w-1/2"
  if (ratio >= 0.125) return "w-1/4"
  return "w-0"
}

export function UsersCrudView() {
  const usersQuery = useAdminUsersQuery()
  const createMutation = useCreateAdminUserMutation()
  const deleteMutation = useDeleteAdminUserMutation()

  const users = (usersQuery.data as UsersResponse | undefined)?.users ?? []

  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("ALL")
  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>("ALL")

  const [itemsPerPage, setItemsPerPage] = React.useState(20)
  const [page, setPage] = React.useState(1)

  const filteredUsers = React.useMemo(() => {
    return users.filter(
      (user) =>
        matchesStatus(user, statusFilter) &&
        (roleFilter === "ALL" ? true : user.role === roleFilter)
    )
  }, [roleFilter, statusFilter, users])

  React.useEffect(() => {
    setPage(1)
  }, [itemsPerPage, roleFilter, statusFilter])

  const total = filteredUsers.length
  const pageCount = Math.max(1, Math.ceil(total / itemsPerPage))
  const safePage = Math.min(page, pageCount)
  const startIndex = (safePage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, total)

  const pageUsers = filteredUsers.slice(startIndex, endIndex)

  const activeCount = users.filter((user) => user.emailVerified).length
  const pendingCount = users.filter((user) => !user.emailVerified).length
  const adminsCount = users.filter((user) => user.role === "ADMIN").length

  const [createOpen, setCreateOpen] = React.useState(false)
  const [createState, setCreateState] = React.useState<UserCreateState>(() =>
    toCreateState()
  )

  const [editOpen, setEditOpen] = React.useState(false)
  const [editUserId, setEditUserId] = React.useState<string | null>(null)
  const [editState, setEditState] = React.useState<UserEditState | null>(null)

  const editUser = React.useMemo(
    () => users.find((user) => user.id === editUserId) ?? null,
    [users, editUserId]
  )

  const updateMutation = useUpdateAdminUserMutation(editUserId ?? "")

  React.useEffect(() => {
    if (!editOpen) {
      setEditUserId(null)
      setEditState(null)
      return
    }

    if (editUser) {
      setEditState(toEditState(editUser))
    }
  }, [editOpen, editUser])

  const busy =
    usersQuery.isLoading ||
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  async function handleCreateSubmit(event: React.FormEvent) {
    event.preventDefault()

    await createMutation.mutateAsync({
      name: createState.name,
      email: createState.email,
      password: createState.password,
      role: createState.role,
    })

    setCreateOpen(false)
    setCreateState(toCreateState())
  }

  async function handleEditSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (!editUserId || !editState) return

    await updateMutation.mutateAsync({
      name: editState.name,
      email: editState.email,
      role: editState.role,
    })

    setEditOpen(false)
  }

  async function handleDelete(userId: string, name: string) {
    const ok = window.confirm(`Delete '${name}'?`)
    if (!ok) return

    await deleteMutation.mutateAsync(userId)
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border border-border bg-card p-6 text-card-foreground lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <nav className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Administration</span>
            <span>/</span>
            <span className="text-foreground">User Management</span>
          </nav>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Users
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Manage platform access, roles, and invitation status for your team.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger
            render={
              <Button className="carbon-button-primary" disabled={busy} />
            }
          >
            Add New User
            <MaterialSymbol className="text-[18px]" icon="add" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add user</DialogTitle>
              <DialogDescription>
                Create a new user account for this business.
              </DialogDescription>
            </DialogHeader>

            <form className="grid gap-4" onSubmit={handleCreateSubmit}>
              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Name
                </span>
                <input
                  className="carbon-input"
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

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Email address
                </span>
                <input
                  className="carbon-input"
                  required
                  type="email"
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
                  Temporary password
                </span>
                <input
                  className="carbon-input"
                  required
                  type="password"
                  value={createState.password}
                  onChange={(event) =>
                    setCreateState((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="grid gap-2 text-sm text-foreground">
                <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                  Role
                </span>
                <Select
                  value={createState.role}
                  onValueChange={(value) =>
                    setCreateState((prev) => ({
                      ...prev,
                      role: (value ?? "MANAGER") as UserRole,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                  {createMutation.isPending ? (
                    <>
                      <Spinner />
                      Creating
                    </>
                  ) : (
                    "Create user"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>
      {/* Analytics */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="border border-border bg-card p-6 text-card-foreground">
          <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Active seats
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            {activeCount}
            <span className="text-lg font-medium text-muted-foreground">
              /{users.length}
            </span>
          </p>
          <div className="mt-5 h-1 w-full bg-muted">
            <div
              className={cn(
                "h-full bg-primary transition-[width] duration-200",
                progressWidthClass(activeCount, users.length)
              )}
            />
          </div>
        </div>

        <div className="border border-border bg-card p-6 text-card-foreground">
          <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
            Pending invites
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            {pendingCount}
          </p>
          <p className="mt-4 text-xs text-muted-foreground italic">
            Pending users are not yet email-verified.
          </p>
        </div>

        <div className="border border-border bg-primary p-6 text-primary-foreground">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase opacity-80">
            Role coverage
          </p>
          <p className="mt-3 text-lg leading-6 font-medium">
            {adminsCount} admin(s) and {users.length - adminsCount} manager(s)
            configured.
          </p>
          <button className="mt-6 text-sm underline underline-offset-4">
            Security Report →
          </button>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="flex flex-col gap-3 border border-border bg-card p-4 text-card-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-44">
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter((value ?? "ALL") as StatusFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Status: All</SelectItem>
                <SelectItem value="ACTIVE">Status: Active</SelectItem>
                <SelectItem value="PENDING">Status: Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-44">
            <Select
              value={roleFilter}
              onValueChange={(value) =>
                setRoleFilter((value ?? "ALL") as RoleFilter)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Role: All</SelectItem>
                <SelectItem value="ADMIN">Role: Admin</SelectItem>
                <SelectItem value="MANAGER">Role: Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <span className="text-xs text-muted-foreground">
            {users.length} Users Total
          </span>
          <Button size="icon" variant="outline" disabled={busy}>
            <MaterialSymbol icon="filter_list" />
          </Button>
          <Button size="icon" variant="outline" disabled={busy}>
            <MaterialSymbol icon="download" />
          </Button>
        </div>
      </section>

      {/* User List */}
      <section className="border border-border bg-card text-card-foreground">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold text-foreground">
            User directory
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {usersQuery.isLoading ? <Spinner /> : null}
            {total} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-255 text-left text-sm">
            <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">
                  <input
                    aria-label="Select all"
                    className="size-4 rounded-none border border-border bg-background"
                    type="checkbox"
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email address</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Loading users…
                    </div>
                  </td>
                </tr>
              ) : pageUsers.length ? (
                pageUsers.map((user, index) => {
                  const pending = !user.emailVerified
                  const zebra = index % 2 === 1

                  return (
                    <tr
                      className={cn(
                        "border-b border-border transition-colors hover:bg-muted/50",
                        zebra && "bg-muted/20"
                      )}
                      key={user.id}
                    >
                      <td className="px-4 py-3">
                        <input
                          aria-label={`Select ${user.name}`}
                          className="size-4 rounded-none border border-border bg-background"
                          type="checkbox"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {user.name}
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {user.lastActiveAt
                            ? `Last active ${formatDashboardDateTime(user.lastActiveAt)}`
                            : "Never active"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center border px-2 py-0.5 text-xs font-medium",
                            user.role === "ADMIN"
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground"
                          )}
                        >
                          {user.role === "ADMIN" ? "Admin" : "Manager"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              pending ? "bg-muted-foreground" : "bg-emerald-500"
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm",
                              pending && "text-muted-foreground italic"
                            )}
                          >
                            {pending ? "Pending" : "Active"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                            disabled={busy}
                          >
                            <MaterialSymbol icon="more_vert" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditUserId(user.id)
                                setEditOpen(true)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(user.id, user.name)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end justify-between gap-3 border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                const next = Number(value)
                if (Number.isFinite(next) && next > 0) {
                  setItemsPerPage(next)
                }
              }}
            >
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            {total
              ? `${startIndex + 1} – ${endIndex} of ${total} items`
              : "0 items"}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={busy || safePage <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              title="Previous"
            >
              <MaterialSymbol icon="chevron_left" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={busy || safePage >= pageCount}
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              title="Next"
            >
              <MaterialSymbol icon="chevron_right" />
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
            <DialogDescription>Update user details and role.</DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={handleEditSubmit}>
            <label className="grid gap-2 text-sm text-foreground">
              <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Name
              </span>
              <input
                className="carbon-input"
                required
                value={editState?.name ?? ""}
                onChange={(event) =>
                  setEditState((prev) =>
                    prev
                      ? {
                          ...prev,
                          name: event.target.value,
                        }
                      : prev
                  )
                }
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground">
              <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Email address
              </span>
              <input
                className="carbon-input"
                required
                type="email"
                value={editState?.email ?? ""}
                onChange={(event) =>
                  setEditState((prev) =>
                    prev
                      ? {
                          ...prev,
                          email: event.target.value,
                        }
                      : prev
                  )
                }
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground">
              <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
                Role
              </span>
              <Select
                value={editState?.role ?? "MANAGER"}
                onValueChange={(value) =>
                  setEditState((prev) =>
                    prev
                      ? {
                          ...prev,
                          role: (value ?? "MANAGER") as UserRole,
                        }
                      : prev
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
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
