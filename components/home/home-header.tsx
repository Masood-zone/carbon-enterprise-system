"use client"

import { CarbonBrand } from "@/components/carbon-brand"
import { HomeHeaderActions } from "@/components/auth/home-header-actions"

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
        <HomeHeaderActions />
      </div>
    </header>
  )
}

export { HomeHeader }
