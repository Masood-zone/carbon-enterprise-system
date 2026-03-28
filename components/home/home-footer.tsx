import { CarbonBrand } from "@/components/carbon-brand"

function HomeFooter() {
  return (
    <footer id="support" className="py-8">
      <div className="carbon-section flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <CarbonBrand className="items-start" />
          <p className="mt-3 text-xs text-muted-foreground">
            Smart inventory management for enterprise operations.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted-foreground">
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
          <a className="transition-colors hover:text-foreground" href="/login">
            Login
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="#support"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export { HomeFooter }
