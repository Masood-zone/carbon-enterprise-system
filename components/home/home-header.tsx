import Link from "next/link"

import { ArrowRight } from "lucide-react"

import { CarbonBrand } from "@/components/carbon-brand"

function HomeHeader() {
  return (
    <header className="border-b border-border bg-background/95">
      <div className="carbon-section flex h-16 items-center justify-between gap-6">
        <CarbonBrand />
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
          <Link className="carbon-button-primary" href="/onboarding">
            Get started
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  )
}

export { HomeHeader }
