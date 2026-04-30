'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({ name, placeholder }: { name: string; placeholder: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        required
        minLength={8}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-surface placeholder:text-surface/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-surface/40 hover:text-surface/70 transition-colors p-1"
        tabIndex={-1}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

export function PasswordSetupForm({
  code,
  email,
  action,
}: {
  code: string
  email: string
  action: (formData: FormData) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)

  return (
    <form
      action={action}
      onSubmit={() => setLoading(true)}
      className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-6"
    >
      <input type="hidden" name="code" value={code} />
      <input type="hidden" name="email" value={email} />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface/70 mb-2">
            Nueva contrasena
          </label>
          <PasswordInput name="password" placeholder="Minimo 8 caracteres" />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface/70 mb-2">
            Confirmar contrasena
          </label>
          <PasswordInput name="password_confirm" placeholder="Repite tu contrasena" />
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="marketing_consent"
            value="true"
            className="mt-1 w-4 h-4 rounded accent-[#e1c385] cursor-pointer"
          />
          <span className="text-surface/60 text-sm leading-relaxed">
            Acepto recibir contenido de bienestar, promociones y novedades de Natuaroma.
            Puedes cancelar en cualquier momento.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-primary font-semibold py-3 px-6 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Creando tu cuenta...' : 'Guardar y entrar al portal'}
      </button>
    </form>
  )
}
