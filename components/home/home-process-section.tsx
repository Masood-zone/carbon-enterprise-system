const implementationSteps = [
  {
    title: "Register",
    description:
      "Create your organization account and invite the people who need access.",
  },
  {
    title: "Configure",
    description:
      "Connect your workflows, data sources, and operational parameters.",
  },
  {
    title: "Launch",
    description:
      "Go live with a single operating view for your business functions.",
  },
]

function HomeProcessSection() {
  return (
    <section id="process" className="py-20">
      <div className="carbon-section">
        <div className="text-center">
          <p className="carbon-kicker text-primary">Implementation</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Accelerate your rollout.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Designed for fast adoption, the platform keeps the path from setup
            to day-to-day use short and predictable.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {implementationSteps.map((step, index) => (
            <article
              key={step.title}
              className="border border-border bg-muted p-6"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center bg-primary/15 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export { HomeProcessSection }
