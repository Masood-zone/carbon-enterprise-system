import { UsersCrudView } from "@/components/dashboard/crud/users-crud-view"
import { requireAdminDashboardSession } from "@/lib/dashboard/session"

export default async function UsersPage() {
  await requireAdminDashboardSession()

  return <UsersCrudView />
}
