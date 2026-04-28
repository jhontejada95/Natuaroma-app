import type { Metadata } from 'next'
import { Noto_Serif, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { CartButton } from '@/components/CartButton'
import { CartDrawer } from '@/components/CartDrawer'

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Natuaroma — Bienestar que se siente, se respira y se vive',
  description: 'Aceites esenciales, velas y aromas artesanales 100% naturales. Hecho en Colombia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={notoSerif.variable + ' ' + beVietnamPro.variable}>
      <body className="bg-background text-on-surface antialiased overflow-x-hidden" style={{ fontFamily: 'var(--font-body), sans-serif' }}>

        {/* Floating glassmorphism nav */}
        <header className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
          <div className="rounded-full px-6 py-3 bg-surface/80 backdrop-blur-md ambient-shadow flex justify-between items-center">
            <a href="/" className="text-xl font-display font-semibold tracking-tight text-primary italic">
              Natuaroma
            </a>
            <nav className="hidden md:flex gap-8 items-center">
              {[
                { href: '/tienda', label: 'Tienda' },
                { href: '/#wellness', label: 'Wellness' },
                { href: '/#nosotros', label: 'Nosotros' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 font-body"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <CartButton />
            </div>
          </div>
        </header>

        <CartDrawer />

        <main className="pt-20">
          {children}
        </main>

        {/* Wave footer */}
        <footer className="footer-wave mt-24 bg-primary-container text-inverse-on-surface">
          <div className="max-w-7xl mx-auto px-8 pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-2xl font-display font-semibold italic text-inverse-on-surface">Natuaroma</p>
              <p className="text-sm text-inverse-on-surface/50 mt-1">Bienestar artesanal. Hecho en Colombia.</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-6">
              {[
                { href: '/tienda', label: 'Tienda' },
                { href: '/#wellness', label: 'Wellness App' },
                { href: '/#nosotros', label: 'Nosotros' },
                { href: 'mailto:natuaroma@gmail.com', label: 'Contacto' },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="text-sm italic text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors duration-300">
                  {label}
                </a>
              ))}
            </nav>
            <p className="text-sm italic text-inverse-on-surface/40">
              &copy; 2025 Natuaroma. Cultivado en Colombia.
            </p>
          </div>
        </footer>

      </body>
    </html>
  )
}
