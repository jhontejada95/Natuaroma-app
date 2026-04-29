export default function HabitosLoading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="h-9 w-56 bg-surface-container rounded-xl animate-pulse" />
      <div className="h-36 bg-primary/20 rounded-2xl animate-pulse" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface rounded-2xl border border-outline-variant animate-pulse" />
        ))}
      </div>
    </div>
  )
}
