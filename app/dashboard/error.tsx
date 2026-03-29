"use client"

import Link from "next/link"

export default function DashboardError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  return (
    <section className="border border-border bg-card p-6 text-card-foreground">
      <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
        Dashboard error
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-foreground">
        We could not load this dashboard view.
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        {error.message}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="carbon-button-primary" onClick={reset} type="button">
          Try again
        </button>
        <Link className="carbon-button-secondary" href="/dashboard">
          Return to dashboard
        </Link>
      </div>
    </section>
  )
}
