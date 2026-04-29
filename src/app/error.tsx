'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 mx-auto organic-blob bg-error-container flex items-center justify-center">
          <span className="text-4xl">🍂</span>
        </div>
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-outline mb-3">Algo salió mal</p>
          <h1 className="font-display text-4xl italic text-primary mb-3">Un momento inesperado</h1>
          <p className="font-body text-on-surface-variant leading-relaxed">
            Ocurrió un error en nuestra app. No te preocupes, nuestro equipo ya fue notificado.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-secondary-fixed text-on-secondary-fixed rounded-full px-6 py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim transition-colors"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="border border-outline-variant text-on-surface-variant rounded-full px-6 py-3 font-body text-xs uppercase tracking-widest hover:bg-surface-container transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
