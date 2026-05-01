'use client'

import { useState } from 'react'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { updateWellnessPassword } from './actions'

export default function WellnessResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Leaf size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Natuaroma Wellness</h1>
          <p className="text-surface/60">Crear nueva contraseña</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-8 space-y-5">
          <div className="space-y-1">
            <h2 className="text-surface font-semibold text-base">Nueva contraseña</h2>
            <p className="text-surface/50 text-sm">Elige una contraseña segura de al menos 8 caracteres.</p>
          </div>

          {searchParams?.error && (
            <div className="bg-error/20 border border-error/30 text-surface rounded-xl p-3 text-sm text-center">
              {searchParams.error}
            </div>
          )}

          <form action={updateWellnessPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface/70 mb-2">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
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

            <div>
              <label className="block text-sm font-medium text-surface/70 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="password_confirm"
                  required
                  minLength={8}
                  placeholder="Repite la contraseña"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface/40 hover:text-surface/70 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors"
            >
              Guardar nueva contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
