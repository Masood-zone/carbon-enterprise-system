import { cn } from "@/lib/utils"

type CarbonBrandProps = {
  className?: string
  markClassName?: string
  compactOnMobile?: boolean
}

function CarbonBrand({
  className,
  markClassName,
  compactOnMobile,
}: CarbonBrandProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 64 64"
        className={cn(
          compactOnMobile
            ? "h-8 w-8 shrink-0 sm:h-10 sm:w-10"
            : "h-10 w-10 shrink-0",
          markClassName
        )}
      >
        <path d="M32 3 7 17.5v29L32 61l25-14.5v-29Z" fill="#2d313a" />
        <path d="M32 3 7 17.5V32l25-14.5L57 32V17.5Z" fill="#0f62fe" />
        <path d="M32 20 17 28.5v17L32 54l15-8.5v-17Z" fill="#ffffff" />
        <path d="M32 20 47 28.5V36L32 27.5 17 36v-7.5Z" fill="#d0d4da" />
      </svg>
      <div
        className={cn(
          "leading-none",
          compactOnMobile ? "text-[0.85rem] sm:text-[1.05rem]" : ""
        )}
      >
        <div className="font-semibold tracking-tight text-current">Carbon</div>
        <div className="text-[0.72rem] text-current/70 sm:text-sm">
          Enterprise
        </div>
      </div>
    </div>
  )
}

export { CarbonBrand }
