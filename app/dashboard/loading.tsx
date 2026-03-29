export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-80 animate-pulse bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="h-28 animate-pulse border border-border bg-muted"
            key={index}
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
        <div className="h-96 animate-pulse border border-border bg-muted" />
        <div className="h-96 animate-pulse border border-border bg-muted" />
      </div>
    </div>
  )
}
