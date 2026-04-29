'use client'

import { useEffect, useState } from 'react'
import { X, Share, Plus, Chrome } from 'lucide-react'

type Platform = 'ios' | 'android' | 'other'

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
  const isAndroid = /Android/.test(ua)
  if (isIOS) return 'ios'
  if (isAndroid) return 'android'
  return 'other'
}

function isInStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

interface PWAInstallGuideProps {
  onClose: () => void
}

export function PWAInstallGuide({ onClose }: PWAInstallGuideProps) {
  const [platform, setPlatform] = useState<Platform>('other')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    setPlatform(detectPlatform())

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setTimeout(onClose, 2000)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [onClose])

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
      setTimeout(onClose, 2000)
    }
    setDeferredPrompt(null)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#1a2b1d] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X size={14} className="text-white/70" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="text-2xl">Natuaroma</div>
          <h2 className="text-white font-semibold text-lg leading-tight">
            Instala tu app de bienestar
          </h2>
          <p className="text-white/50 text-sm">
            Accede a tu portal Wellness desde la pantalla de inicio, sin abrir el navegador.
          </p>
        </div>

        {installed ? (
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 text-center space-y-1">
            <div className="text-2xl">Instalado</div>
            <p className="text-white text-sm font-medium">Natuaroma esta en tu pantalla de inicio</p>
          </div>
        ) : platform === 'ios' ? (
          <IOSSteps />
        ) : platform === 'android' && deferredPrompt ? (
          <AndroidInstall onInstall={handleAndroidInstall} />
        ) : (
          <DesktopInstructions />
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          Ahora no
        </button>
      </div>
    </div>
  )
}

function IOSSteps() {
  const steps = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Toca el boton Compartir',
      sub: 'El icono de la flecha en la barra del navegador'
    },
    {
      icon: <Plus size={20} />,
      label: 'Selecciona "Agregar a inicio"',
      sub: 'Desplazate hacia abajo en el menu'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Presiona "Agregar"',
      sub: 'La app aparecera en tu pantalla de inicio'
    },
  ]

  return (
    <div className="space-y-3">
      <p className="text-white/60 text-xs uppercase tracking-wider font-medium">Pasos en Safari</p>
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3 bg-white/5 rounded-2xl p-3.5">
          <div className="w-8 h-8 rounded-full bg-[#e1c385]/20 flex items-center justify-center flex-shrink-0 text-[#e1c385]">
            {step.icon}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{step.label}</p>
            <p className="text-white/40 text-xs mt-0.5">{step.sub}</p>
          </div>
        </div>
      ))}
      <p className="text-white/30 text-xs text-center pt-1">Solo disponible desde Safari</p>
    </div>
  )
}

function AndroidInstall({ onInstall }: { onInstall: () => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#e1c385]/20 flex items-center justify-center flex-shrink-0">
          <Chrome size={20} className="text-[#e1c385]" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">Instalar Natuaroma</p>
          <p className="text-white/40 text-xs">Se agregara a tu pantalla de inicio</p>
        </div>
      </div>
      <button
        onClick={onInstall}
        className="w-full bg-[#e1c385] text-[#223426] font-semibold py-3 rounded-xl hover:bg-[#d4b574] transition-colors"
      >
        Instalar ahora
      </button>
    </div>
  )
}

function DesktopInstructions() {
  return (
    <div className="bg-white/5 rounded-2xl p-4 space-y-2">
      <p className="text-white/70 text-sm">En Chrome, busca el icono de instalacion en la barra de direcciones, o abre el menu y selecciona</p>
      <p className="text-white font-medium text-sm">"Instalar Natuaroma Wellness"</p>
    </div>
  )
}

// Hook to control display logic
export function usePWAInstallGuide() {
  const [show, setShow] = useState(false)

  const showGuide = () => {
    if (typeof window === 'undefined') return
    if (isInStandaloneMode()) return
    setShow(true)
  }

  const hideGuide = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa_guide_shown', '1')
    }
    setShow(false)
  }

  return { show, showGuide, hideGuide }
}
