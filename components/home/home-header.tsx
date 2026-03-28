import Link from "next/link"

import { ArrowRight, Menu, X } from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"

function HomeHeader() {
  return (
    <header className="border-b border-border bg-background/95">
      <div className="carbon-section flex h-auto items-start justify-between gap-4 py-3 sm:h-16 sm:items-center sm:gap-6">
        <CarbonBrand compactOnMobile />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a
            className="transition-colors hover:text-foreground"
            href="#features"
          >
            Product
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="#process"
          >
            Implementation
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="#support"
          >
            Support
          </a>
        </nav>
        <div className="flex items-center gap-3">
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
        </div>
        <details className="group relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-center rounded-none border border-border bg-background p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
            <Menu className="h-5 w-5 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-5 w-5 group-open:block" aria-hidden="true" />
            <span className="sr-only">Open navigation menu</span>
          </summary>
          <div className="absolute top-full right-0 z-50 mt-2 w-[18rem] border border-border bg-background p-4 shadow-sm">
            <div className="space-y-3 text-sm text-muted-foreground">
              <a
                className="block transition-colors hover:text-foreground"
                href="#features"
              >
                Product
              </a>
              <a
                className="block transition-colors hover:text-foreground"
                href="#process"
              >
                Implementation
              </a>
              <a
                className="block transition-colors hover:text-foreground"
                href="#support"
              >
                Support
              </a>
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
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
            </div>
          </div>
        </details>
      </div>
    </header>
  )
}

export { HomeHeader }
