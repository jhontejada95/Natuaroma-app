export default function BibliotecaLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="h-9 w-72 bg-surface-container rounded-xl animate-pulse" />
      <div className="flex gap-3 flex-wrap">
        {[80, 110, 95, 100, 90].map((w, i) => (
          <div key={i} className="h-9 bg-surface-container rounded-full animate-pulse" style={{ width: w }} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-outline-variant overflow-hidden animate-pulse">
            <div className="h-36 bg-surface-container-high" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-surface-container rounded-full w-2/3" />
              <div className="h-3 bg-surface-container rounded-full w-full" />
              <div className="h-3 bg-surface-container rounded-full w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
