import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { cn } from "@/lib/utils"

export function ActivityFeed({
  items,
  title,
}: {
  items: Array<{
    description: string
    icon: string
    meta: string
    tone?: "default" | "danger" | "success" | "warning"
    title: string
  }>
  title: string
}) {
  return (
    <section className="border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article className="flex gap-3" key={`${item.title}-${item.meta}`}>
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center border",
                item.tone === "danger" &&
                  "border-red-200 bg-red-50 text-red-600",
                item.tone === "success" &&
                  "border-emerald-200 bg-emerald-50 text-emerald-600",
                item.tone === "warning" &&
                  "border-amber-200 bg-amber-50 text-amber-600",
                (!item.tone || item.tone === "default") &&
                  "border-border bg-background text-primary"
              )}
            >
              <MaterialSymbol className="text-[18px]" icon={item.icon} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {item.meta}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
