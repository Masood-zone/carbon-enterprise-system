import { ActivityFeed } from "@/components/dashboard/widgets/activity-feed"
import { StatsCard } from "@/components/dashboard/widgets/stats-card"
import {
  fetchDashboardApi,
  requireAdminDashboardSession,
} from "@/lib/dashboard/session"
import { formatDashboardDateTime } from "@/lib/dashboard/format"

type UsersResponse = {
  users: Array<{
    createdAt: string
    email: string
    emailVerified: boolean
    id: string
    image?: string | null
    lastActiveAt?: string | null
    name: string
    role: "ADMIN" | "MANAGER"
    updatedAt: string
  }>
}

export default async function UsersPage() {
  await requireAdminDashboardSession()

  const { users } = await fetchDashboardApi<UsersResponse>("/api/admin/users")

  const admins = users.filter((user) => user.role === "ADMIN")
  const managers = users.filter((user) => user.role === "MANAGER")
  const activeUsers = users.filter((user) => Boolean(user.lastActiveAt))

  return (
    <div className="space-y-6">
      <section className="border border-border bg-card p-6 text-card-foreground">
        <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
          Access control
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          Users.
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          User administration is admin-only and sourced from the admin users
          route.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          icon="manage_accounts"
          title="Users"
          value={String(users.length)}
        />
        <StatsCard
          icon="admin_panel_settings"
          title="Admins"
          value={String(admins.length)}
        />
        <StatsCard
          icon="group"
          title="Managers"
          value={String(managers.length)}
        />
        <StatsCard
          icon="schedule"
          title="Recently active"
          value={String(activeUsers.length)}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)]">
        <div className="border border-border bg-card text-card-foreground">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <h2 className="text-base font-semibold text-foreground">
              User directory
            </h2>
            <p className="text-xs text-muted-foreground">
              {users.length} records
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-border bg-muted text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Verified</th>
                  <th className="px-4 py-3">Last active</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    className="border-b border-border last:border-b-0"
                    key={user.id}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.emailVerified ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.lastActiveAt
                        ? formatDashboardDateTime(user.lastActiveAt)
                        : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ActivityFeed
          items={users.slice(0, 5).map((user) => ({
            description: user.emailVerified
              ? "Email verified"
              : "Email pending verification",
            icon: user.role === "ADMIN" ? "admin_panel_settings" : "group",
            meta: user.lastActiveAt
              ? formatDashboardDateTime(user.lastActiveAt)
              : "Inactive",
            title: user.name,
            tone: user.role === "ADMIN" ? "success" : "default",
          }))}
          title="Role summary"
        />
      </div>
    </div>
  )
}
