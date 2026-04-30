'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'

interface Props {
  next: string
  email?: string
  welcome?: boolean
}

export function WellnessPasswordLogin({ next, email = '', welcome = false }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return  // guard extra contra doble envio
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const emailVal = (form.elements.namedItem('email') as HTMLInputElement).value.trim().toLowerCase()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email: emailVal, password })

    if (authError) {
      setError('Correo o contrasena incorrectos.')
      setLoading(false)
      return
    }

    // Hard navigation — garantiza que el servidor lea la nueva sesion desde las cookies
    // Evita race conditions de router.push + router.refresh simultaneos
    // Solo permitir rutas internas para evitar open redirect
    const safePath = next.startsWith('/') && !next.startsWith('//') ? next : '/wellness'
    window.location.href = safePath
  }

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-8 space-y-5">
      {welcome && (
        <div className="bg-accent/15 border border-accent/30 rounded-xl p-4 text-center space-y-1">
          <p className="text-accent font-semibold text-sm">Cuenta creada exitosamente</p>
          <p className="text-surface/60 text-xs">Ingresa con tu correo y la contrasena que acabas de crear.</p>
        </div>
      )}

      <div className="space-y-1">
        <h2 className="text-surface font-semibold text-base">Ingresa al portal</h2>
        <p className="text-surface/50 text-sm">
          Usa el correo y la contrasena que configuraste.
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
            defaultValue={email}
            placeholder="tu@correo.com"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface/70 mb-2">
            Contrasena
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Tu contrasena"
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface/40 hover:text-surface/70 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
