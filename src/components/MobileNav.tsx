'use client'

import { useState } from 'react'
import { Menu, X, Leaf } from 'lucide-react'

const NAV_LINKS = [
  { href: '/tienda', label: 'Tienda' },
  { href: '/#wellness', label: 'Wellness App' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/wellness', label: 'Portal Wellness' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-primary/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-surface z-50 flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <Leaf size={18} className="text-primary" />
            <span className="font-display font-semibold italic text-primary">Natuaroma</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-dim text-on-surface-variant transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl font-body text-sm text-on-surface hover:bg-surface-container hover:text-primary transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="p-6 border-t border-outline-variant">
          <a
            href="/tienda"
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-secondary-fixed text-on-secondary-fixed rounded-full py-3 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim transition-colors ambient-shadow"
          >
            Explorar botánicos
          </a>
        </div>
      </div>
    </>
  )
}
