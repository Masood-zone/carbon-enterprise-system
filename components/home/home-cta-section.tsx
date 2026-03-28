import Link from "next/link"

function HomeCtaSection() {
  return (
    <section className="border-y border-border bg-primary text-primary-foreground">
      <div className="carbon-section flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to transform your business?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-primary-foreground/80">
            Join teams that use Carbon to keep operations, inventory, and
            reporting in sync.
          </p>
        </div>
        <Link
          className="inline-flex h-12 items-center justify-center bg-background px-5 text-sm font-medium text-primary transition-colors hover:bg-white/90"
          href="/onboarding"
        >
          Get started today
        </Link>
      </div>
    </section>
  )
}

export { HomeCtaSection }
