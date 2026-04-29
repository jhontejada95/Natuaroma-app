import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary-fixed/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg space-y-8">
        {/* Botanical illustration placeholder */}
        <div className="w-40 h-40 mx-auto organic-blob bg-primary-fixed/30 flex items-center justify-center">
          <span className="text-6xl">🌿</span>
        </div>

        <div>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-outline mb-3">Error 404</p>
          <h1 className="font-display text-5xl md:text-6xl italic text-primary leading-tight mb-4">
            Este camino<br />no existe
          </h1>
          <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-sm mx-auto">
            Como una flor salvaje, la página que buscas no se encuentra aquí.
            Quizás fue movida, o simplemente siguió su propio camino.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-secondary-fixed text-on-secondary-fixed rounded-full px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim hover:scale-105 transition-all duration-300 ambient-shadow"
          >
            Volver al inicio
          </Link>
          <Link
            href="/tienda"
            className="border border-outline-variant text-on-surface-variant rounded-full px-8 py-3 font-body text-xs uppercase tracking-widest hover:bg-surface-container hover:text-primary transition-all duration-300"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  )
}
