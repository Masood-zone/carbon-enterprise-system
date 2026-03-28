import Link from "next/link"
import { CarbonBrand } from "@/components/carbon-brand"
import { LoginForm } from "./login-form"

export const metadata = {
  title: "Login - Carbon Enterprise",
  description: "Secure login to access your Carbon Enterprise dashboard.",
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
              The operating system for modern businesses.
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

          <div className="space-y-8">
            <LoginForm />
          </div>

          <footer className="mt-16 border-t border-border pt-8 text-xs text-muted-foreground">
            <p className="mb-4">Don&apos;t have a business account?</p>
            <Link
              className="font-semibold text-primary hover:underline"
              href="/onboarding/step-1"
            >
              Get Started Today
            </Link>
          </footer>
        </div>
      </section>
    </main>
  )
}
