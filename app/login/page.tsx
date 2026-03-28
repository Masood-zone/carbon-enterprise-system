import Link from "next/link"

import { ArrowRight, Eye, KeyRound, ShieldCheck } from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"

export const metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <main className="carbon-page grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="carbon-auth-shell relative hidden overflow-hidden border-r border-border bg-[#101317] text-white lg:flex">
        <div className="relative z-10 flex min-h-svh w-full flex-col justify-between p-10 xl:p-16">
          <CarbonBrand className="text-white" />

          <div className="max-w-2xl pb-8">
            <p className="carbon-kicker text-white/60">Secure access</p>
            <h1 className="mt-5 text-5xl leading-tight font-light tracking-tight xl:text-6xl">
              The operating system for modern enterprise.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/70">
              Unified data, streamlined workflows, and clear accountability for
              teams that need dependable operations every day.
            </p>

            <div className="mt-10 flex flex-wrap gap-6 text-[10px] font-semibold tracking-[0.35em] text-white/55 uppercase">
              <span>Reliability</span>
              <span>Scalability</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:mb-12">
            <div className="lg:hidden">
              <CarbonBrand />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
              Log in
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back. Please enter your details.
            </p>
          </div>

          <form className="space-y-8">
            <div className="space-y-2">
              <label
                className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase"
                htmlFor="user-id"
              >
                User ID
              </label>
              <input
                className="carbon-input"
                id="user-id"
                name="user-id"
                placeholder="name@company.com"
                type="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between gap-4">
                <label
                  className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  className="carbon-input pr-12"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                />
                <button
                  aria-label="Show password"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  type="button"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="pt-1">
                <Link
                  className="text-xs font-medium text-primary hover:underline"
                  href="/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              className="carbon-button-primary w-full justify-between px-4"
              type="submit"
            >
              <span>Continue to workspace</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="pt-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-bold tracking-[0.32em] text-muted-foreground uppercase">
                  Enterprise access
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-px border border-border bg-border">
                <button
                  className="flex h-12 items-center justify-center gap-2 bg-background text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  type="button"
                >
                  <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                  SSO
                </button>
                <button
                  className="flex h-12 items-center justify-center gap-2 bg-background text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  type="button"
                >
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  IAM
                </button>
              </div>
            </div>
          </form>

          <footer className="mt-16 border-t border-border pt-8 text-xs text-muted-foreground">
            <p className="mb-4">Don&apos;t have a business account?</p>
            <Link
              className="font-semibold text-primary hover:underline"
              href="/"
            >
              Explore Carbon Enterprise
            </Link>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              <a className="transition-colors hover:text-foreground" href="#">
                Privacy
              </a>
              <a className="transition-colors hover:text-foreground" href="#">
                Terms
              </a>
            </div>
          </footer>
        </div>
      </section>
    </main>
  )
}
