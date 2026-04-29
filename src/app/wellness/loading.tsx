export default function WellnessLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-surface-container rounded-xl animate-pulse" />
        <div className="h-4 w-48 bg-surface-container rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-28 bg-surface rounded-2xl border border-outline-variant animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="h-40 bg-surface rounded-2xl border border-outline-variant animate-pulse" />
        ))}
      </div>
    </div>
  )
}
