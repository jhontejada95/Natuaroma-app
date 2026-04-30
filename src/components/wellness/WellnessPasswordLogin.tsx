'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function WellnessPasswordLogin({ next }: { next: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim().toLowerCase()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Correo o contrasena incorrectos.')
      setLoading(false)
      return
    }

    router.push(next)
    router.refresh()
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-8 space-y-5">
      <div className="space-y-1">
        <h2 className="text-surface font-semibold text-base">Ingresa con tu contrasena</h2>
        <p className="text-surface/50 text-sm">
          Usa el correo y la contrasena que configuraste al activar tu acceso.
        </p>
      </div>

      {error && (
        <div className="bg-error/20 border border-error/30 text-surface rounded-xl p-3 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface/70 mb-2">
            Correo electronico
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="tu@correo.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface/70 mb-2">
            Contrasena
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="Tu contrasena"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Ingresando...' : 'Ingresar al portal'}
        </button>
      </form>

      <div className="text-center pt-1">
        <p className="text-surface/40 text-xs">
          Olvidaste tu contrasena?{' '}
          <a href="/wellness/activar" className="text-accent hover:underline">
            Reactiva tu codigo
          </a>
        </p>
      </div>
    </div>
  )
}
