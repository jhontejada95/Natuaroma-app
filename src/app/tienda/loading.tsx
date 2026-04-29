export default function TiendaLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">
      {/* Header skeleton */}
      <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
        <div className="h-12 w-64 bg-surface-container-high rounded-full mx-auto animate-pulse" />
        <div className="h-4 w-96 bg-surface-container rounded-full mx-auto animate-pulse" />
        <div className="h-4 w-72 bg-surface-container rounded-full mx-auto animate-pulse" />
      </div>
      {/* Pills skeleton */}
      <div className="flex justify-center gap-3 mb-16">
        {[80, 100, 90, 110].map((w) => (
          <div key={w} className={`h-9 bg-surface-container-high rounded-full animate-pulse`} style={{ width: w }} />
        ))}
      </div>
      {/* Grid skeleton */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {[320, 260, 380, 290, 350, 270].map((h, i) => (
          <div
            key={i}
            className="organic-card-1 bg-surface-container animate-pulse break-inside-avoid"
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  )
}
