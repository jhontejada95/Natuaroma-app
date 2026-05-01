import type { Metadata, Viewport } from 'next'
import { Noto_Serif, Be_Vietnam_Pro } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'
import { CartButton } from '@/components/CartButton'
import { CartDrawer } from '@/components/CartDrawer'
import { MobileNav } from '@/components/MobileNav'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
if (!siteUrl) {
  throw new Error('NEXT_PUBLIC_SITE_URL is required')
}

export const viewport: Viewport = {
  themeColor: '#223426',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Natuaroma - Bienestar que se siente, se respira y se vive',
  description: 'Aceites esenciales, velas aromáticas y rituales naturales artesanales 100% hechos en Colombia.',
  keywords: ['aceites esenciales', 'velas aromáticas', 'bienestar natural', 'aromaterapia', 'Colombia', 'wellness'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Natuaroma',
  },
  openGraph: {
    title: 'Natuaroma - Bienestar que se siente, se respira y se vive',
    description: 'Productos naturales artesanales de Colombia.',
    url: siteUrl,
    siteName: 'Natuaroma',
    locale: 'es_CO',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={notoSerif.variable + ' ' + beVietnamPro.variable}>
      <body className="bg-background text-on-surface antialiased overflow-x-hidden" style={{ fontFamily: 'var(--font-body), sans-serif' }}>

        <ServiceWorkerRegistration />

        <header className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
          <div className="rounded-full px-6 py-3 bg-surface/80 backdrop-blur-md ambient-shadow flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Natuaroma" width={180} height={48} className="h-10 md:h-12 w-auto object-contain" priority />
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              {[
                { href: '/tienda', label: 'Tienda' },
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/wellness', label: 'Wellness' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors duration-300 font-body"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <CartButton />
              <MobileNav />
            </div>
          </div>
        </header>

        <CartDrawer />
        <WhatsAppButton />

        <main className="pt-20">
          {children}
        </main>

        <footer className="footer-wave mt-24 bg-primary-container text-inverse-on-surface">
          <div className="max-w-7xl mx-auto px-8 pt-20 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-1">
                <p className="text-2xl font-display font-semibold italic text-inverse-on-surface mb-2">Natuaroma</p>
                <p className="text-sm text-inverse-on-surface/50 leading-relaxed">Bienestar artesanal.<br />Hecho en Colombia con amor.</p>
                <a
                  href="https://instagram.com/natuaroma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  @natuaroma
                </a>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest font-semibold text-inverse-on-surface/40 mb-4">Tienda</p>
                <ul className="space-y-2">
                  {[
                    { href: '/tienda', label: 'Todos los productos' },
                    { href: '/tienda?categoria=Aceites', label: 'Aceites esenciales' },
                    { href: '/tienda?categoria=Velas', label: 'Velas aromáticas' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest font-semibold text-inverse-on-surface/40 mb-4">Wellness</p>
                <ul className="space-y-2">
                  {[
                    { href: '/wellness', label: 'Portal Wellness' },
                    { href: '/wellness/activar', label: 'Activar acceso' },
                    { href: '/wellness/biblioteca', label: 'Biblioteca' },
                    { href: '/wellness/habitos', label: 'Hábitos diarios' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link href={href} className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest font-semibold text-inverse-on-surface/40 mb-4">Información</p>
                <ul className="space-y-2">
                  {[
                    { href: '/nosotros', label: 'Nosotros' },
                    { href: 'mailto:hola@natuaroma.co', label: 'Contacto' },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      {href.startsWith('/') ? (
                        <Link href={href} className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors">{label}</Link>
                      ) : (
                        <a href={href} className="text-sm text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors">{label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-inverse-on-surface/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm italic text-inverse-on-surface/30">
                &copy; 2025 Natuaroma. Todos los derechos reservados.
              </p>
              <p className="text-xs text-inverse-on-surface/20">Cultivado en Colombia</p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
