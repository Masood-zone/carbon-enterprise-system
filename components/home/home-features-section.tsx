import {
  Boxes,
  DollarSign,
  FileText,
  LineChart,
  TrendingUp,
  Users2,
} from "lucide-react"

const featureCards = [
  {
    title: "Finance",
    description:
      "Track invoices, expenses, and cash flow with enterprise-grade visibility.",
    icon: DollarSign,
  },
  {
    title: "Inventory",
    description: "Monitor stock across locations and warehouses in real time.",
    icon: Boxes,
  },
  {
    title: "Sales",
    description:
      "Keep pipeline activity and order progress aligned for faster cycles.",
    icon: TrendingUp,
  },
  {
    title: "Insights",
    description:
      "Spot trends early with operational dashboards built for leaders.",
    icon: LineChart,
  },
  {
    title: "Reports",
    description:
      "Generate audit-ready reports that fit internal and external review.",
    icon: FileText,
  },
  {
    title: "Team",
    description:
      "Coordinate access and collaboration across departments and roles.",
    icon: Users2,
  },
]

function HomeFeaturesSection() {
  return (
    <section id="features" className="border-y border-border bg-muted/50 py-20">
      <div className="carbon-section">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="carbon-kicker text-primary">
              Enterprise capabilities
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Every core function, organized in one system.
            </h2>
          </div>
          <p className="hidden max-w-lg text-sm leading-6 text-muted-foreground md:block">
            The interface stays clean and dense enough for operational work
            without losing accessibility or hierarchy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon

            return (
              <article
                key={feature.title}
                className="border border-border bg-background p-6 transition-colors hover:bg-muted"
              >
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { HomeFeaturesSection }
