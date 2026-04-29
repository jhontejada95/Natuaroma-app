export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div className="organic-card-1 aspect-square bg-surface-container animate-pulse" />
      <div className="space-y-6 pt-4">
        <div className="h-4 w-24 bg-surface-container rounded-full animate-pulse" />
        <div className="h-12 w-4/5 bg-surface-container-high rounded-xl animate-pulse" />
        <div className="h-8 w-32 bg-surface-container rounded-xl animate-pulse" />
        <div className="h-4 w-full bg-surface-container rounded-full animate-pulse" />
        <div className="h-4 w-5/6 bg-surface-container rounded-full animate-pulse" />
        <div className="h-4 w-4/6 bg-surface-container rounded-full animate-pulse" />
        <div className="h-14 w-full bg-secondary-fixed/30 rounded-full animate-pulse mt-6" />
      </div>
    </div>
  )
}
