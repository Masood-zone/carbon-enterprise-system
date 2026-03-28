import Link from "next/link"

import { ArrowRight, CircleCheckBig, Gauge, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

const chartBars = [
  "h-[42%]",
  "h-[58%]",
  "h-[47%]",
  "h-[70%]",
  "h-[60%]",
  "h-[82%]",
  "h-[74%]",
  "h-[90%]",
]

function HomeHeroSection() {
  return (
    <section className="carbon-section grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
      <div className="max-w-2xl">
        <p className="carbon-kicker text-primary">Smart inventory management</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Manage and grow your business with operational clarity.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Carbon Enterprise brings inventory, finance, sales, and team workflows
          into a single system built for scale, speed, and accountability.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="carbon-button-primary min-w-44" href="/onboarding">
            Get started
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a className="carbon-button-secondary min-w-44" href="#features">
            Explore platform
          </a>
        </div>
        <dl className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
          <div className="border border-border bg-muted p-4">
            <dt className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Modules
            </dt>
            <dd className="mt-3 text-2xl font-semibold text-foreground">5</dd>
          </div>
          <div className="border border-border bg-muted p-4">
            <dt className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Visibility
            </dt>
            <dd className="mt-3 text-2xl font-semibold text-foreground">
              24/7
            </dd>
          </div>
          <div className="border border-border bg-muted p-4">
            <dt className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
              Audit ready
            </dt>
            <dd className="mt-3 text-2xl font-semibold text-foreground">Yes</dd>
          </div>
        </dl>
      </div>

      <div className="relative">
        <div className="absolute -top-6 -right-6 h-28 w-28 bg-primary/10" />
        <div className="carbon-card relative overflow-hidden bg-[#101820] p-5 text-white shadow-[0_24px_60px_rgba(15,98,254,0.12)]">
          <div className="flex items-center justify-between text-[10px] tracking-[0.3em] text-white/50 uppercase">
            <span>Operations dashboard</span>
            <span>Live</span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-[11px] text-white/60">
                <span>Monthly throughput</span>
                <span>+18.4%</span>
              </div>
              <div className="mt-5 flex h-40 items-end gap-2">
                {chartBars.map((heightClass, index) => (
                  <div key={`${index}-${heightClass}`} className="flex-1">
                    <div className={cn("bg-primary", heightClass)} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 text-[11px] text-white/55">
                <span className="h-2 w-2 bg-primary" />
                <span>Inventory movement by day</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>Open orders</span>
                  <Gauge className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
                <p className="mt-3 text-3xl font-semibold">1,284</p>
              </div>
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>Stock alerts</span>
                  <ShieldCheck
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-3xl font-semibold">12</p>
              </div>
              <div className="border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>Fulfillment rate</span>
                  <CircleCheckBig
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-3xl font-semibold">98.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { HomeHeroSection }
