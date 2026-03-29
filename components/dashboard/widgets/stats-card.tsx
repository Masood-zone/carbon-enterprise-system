import { MaterialSymbol } from "@/components/common/MaterialSymbol"
import { cn } from "@/lib/utils"

export function StatsCard({
  caption,
  change,
  changeTone = "neutral",
  icon,
  title,
  value,
}: {
  caption?: string
  change?: string
  changeTone?: "negative" | "neutral" | "positive"
  icon: string
  title: string
  value: string
}) {
  return (
    <article className="border border-border bg-card px-4 py-4 text-card-foreground">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
            {title}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {caption ? (
            <p className="mt-2 text-xs text-muted-foreground">{caption}</p>
          ) : null}
          {change ? (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                changeTone === "positive" && "text-emerald-600",
                changeTone === "negative" && "text-red-600",
                changeTone === "neutral" && "text-muted-foreground"
              )}
            >
              {change}
            </p>
          ) : null}
        </div>
        <div className="flex size-10 items-center justify-center border border-border bg-background text-primary">
          <MaterialSymbol className="text-[18px]" icon={icon} />
        </div>
      </div>
    </article>
  )
}
