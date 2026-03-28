"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "@/lib/auth-client"
import { userLogout } from "@/services/auth/user-auth"
import { toast } from "sonner"

const navigationLinks = [
  { href: "#features", label: "Product" },
  { href: "#process", label: "Implementation" },
  { href: "#support", label: "Support" },
]

function getInitials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.trim() || "U").split(/\s+/)
  const first = source[0]?.[0] ?? "U"
  const last = source.length > 1 ? source[source.length - 1]?.[0] : ""

  return `${first}${last}`.toUpperCase()
}

export function HomeHeaderActions() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const user = session?.user
  const isAuthenticated = Boolean(user)
  const displayName = user?.name?.trim() || "Account"
  const displayEmail = user?.email?.trim() || "Signed in"
  const initials = getInitials(user?.name, user?.email)

  const handleLogout = async () => {
    try {
      await userLogout()
      toast.success("Signed out")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Unable to sign out")
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden h-11 w-28 rounded-none border border-border bg-muted sm:block" />
        <div className="hidden h-11 w-36 rounded-none border border-border bg-muted sm:block" />
        <div className="flex h-11 w-11 items-center justify-center rounded-none border border-border bg-muted md:hidden">
          <Menu className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <Link
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="carbon-button-primary hidden sm:inline-flex"
              href="/onboarding"
            >
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full border border-border bg-background p-0.5 transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none">
              <Avatar className="size-10">
                {user?.image ? (
                  <AvatarImage src={user.image} alt={displayName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="space-y-0.5 px-3 py-3">
                <div className="text-sm font-medium text-foreground">
                  {displayName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {displayEmail}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard") }>
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/onboarding") }>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                Onboarding
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <details className="group relative md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-center rounded-none border border-border bg-background p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
          <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
          <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
          <span className="sr-only">Open navigation menu</span>
        </summary>
        <div className="absolute top-full right-0 z-50 mt-2 w-[18rem] border border-border bg-background p-4 shadow-sm">
          <div className="space-y-3 text-sm text-muted-foreground">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                className="block transition-colors hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {!isAuthenticated ? (
              <>
                <Link
                  className="inline-flex h-11 items-center justify-center border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  href="/login"
                >
                  Login
                </Link>
                <Link className="carbon-button-primary w-full" href="/onboarding">
                  Get started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="inline-flex h-11 items-center justify-center border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="inline-flex h-11 items-center justify-center border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  href="/onboarding"
                >
                  Onboarding
                </Link>
                <button
                  className="carbon-button-primary w-full justify-between px-4"
                  type="button"
                  onClick={handleLogout}
                >
                  <span>Sign out</span>
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </details>
    </>
  )
}