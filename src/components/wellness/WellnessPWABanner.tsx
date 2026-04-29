'use client'

import { useEffect, useState } from 'react'
import { PWAInstallGuide } from './PWAInstallGuide'

interface WellnessPWABannerProps {
  showImmediate?: boolean
}

export function WellnessPWABanner({ showImmediate = false }: WellnessPWABannerProps) {
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Already installed as PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    if (isStandalone) return

    // Already shown guide before
    const alreadyShown = localStorage.getItem('pwa_guide_shown')
    if (alreadyShown && !showImmediate) return

    // Show after short delay so page loads first
    const timer = setTimeout(() => {
      setShowGuide(true)
    }, showImmediate ? 1200 : 3000)

    return () => clearTimeout(timer)
  }, [showImmediate])

  if (!showGuide) return null

  return (
    <PWAInstallGuide
      onClose={() => {
        localStorage.setItem('pwa_guide_shown', '1')
        setShowGuide(false)
      }}
    />
  )
}
