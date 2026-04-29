import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { TiendaClient } from './TiendaClient'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Tienda — Natuaroma',
  description: 'Explora nuestra cosecha de aceites esenciales, velas aromaticas y rituales naturales artesanales hechos en Colombia.',
  openGraph: { title: 'Tienda Natuaroma — Botanicos artesanales de Colombia', description: 'Aceites esenciales, velas aromaticas y rituales naturales 100% artesanales.' },
}

export default async function TiendaPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('id, name, slug'),
  ])

  return (
    <div className="relative overflow-x-hidden">
      <div className="fixed top-0 right-0 w-[40vw] h-[40vw] bg-primary-fixed-dim/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-[40%] left-[-5%] w-[35vw] h-[35vw] bg-secondary-fixed/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <header className="max-w-3xl mx-auto text-center mb-20 mt-8">
          <h1 className="font-display text-5xl md:text-6xl text-primary italic mb-6">
            Nuestra Cosecha
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Recolectado con intencion, curado con reverencia. Cada elemento proviene de la tierra colombiana,
            preservando las imperfecciones poeticas de la naturaleza.
          </p>
        </header>

        <Suspense fallback={<div className="h-12" />}>
          <TiendaClient
            products={products ?? []}
            categories={categories ?? []}
          />
        </Suspense>
      </div>
    </div>
  )
}
