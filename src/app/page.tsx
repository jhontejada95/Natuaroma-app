export const revalidate = 3600

import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ProductCard'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden botanical-mask pb-24">
        {/* Cinematic background */}
        <div className="absolute inset-0 z-0 bg-primary-container">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1800&q=85"
            alt="Colombian cloud forest botanical"
            fill
            className="object-cover opacity-70 mix-blend-overlay"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-container/20 to-background" />
        </div>

        {/* Ambient blobs */}
        <div className="absolute top-1/4 left-10 w-40 h-40 bg-secondary-fixed/10 organic-blob blur-2xl z-0 pointer-events-none" />
        <div className="absolute bottom-1/3 right-20 w-56 h-56 bg-primary-fixed/15 organic-blob blur-3xl z-0 pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="font-body text-sm uppercase tracking-[0.25em] text-secondary-fixed/90 mb-6">
            Bienestar artesanal &bull; Hecho en Colombia
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-surface-container-lowest mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
            Bienestar que se siente,<br />
            <span className="italic text-secondary-fixed">se respira</span> y se vive
          </h1>
          <p className="font-body text-lg text-surface-container-lowest/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Esencias artesanales enraizadas en la belleza imperfecta del mundo natural.
            Descubre tu santuario sensorial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tienda"
              className="bg-secondary-fixed text-on-secondary-fixed rounded-full px-8 py-4 text-xs font-body font-semibold uppercase tracking-widest hover:bg-secondary-fixed-dim hover:scale-105 transition-all duration-300 ambient-shadow"
            >
              Explorar Botanicos
            </a>
            <a
              href="/wellness"
              className="border border-surface-container-lowest/40 text-surface-container-lowest rounded-full px-8 py-4 text-xs font-body font-semibold uppercase tracking-widest hover:bg-surface-container-lowest/10 transition-all duration-300"
            >
              Wellness App
            </a>
          </div>
        </div>
      </section>

      {/* ===== FEATURED BOTANICALS ===== */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto relative -mt-12">
        <div className="mb-16 md:ml-10">
          <h2 className="font-display text-4xl md:text-5xl text-primary mb-4 italic">
            Botanicos Curados
          </h2>
          <p className="font-body text-on-surface-variant max-w-md leading-relaxed">
            Ingredientes recolectados a mano, transformados en rituales puros y potentes para tu vida diaria.
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Large focus card */}
            {products[0] && (
              <a
                href={'/productos/' + products[0].slug}
                className="md:col-span-7 organic-card-1 relative overflow-hidden group flex flex-col justify-end min-h-[420px] ambient-shadow"
              >
                {products[0].images?.[0] ? (
                  <Image
                    src={products[0].images[0]}
                    alt={products[0].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80"
                    alt={products[0].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                <div className="relative z-10 p-8 text-surface-container-lowest">
                  <span className="font-body text-xs uppercase tracking-widest text-secondary-fixed mb-2 block">
                    {(products[0].categories as any)?.name ?? 'Esencia'}
                  </span>
                  <h3 className="font-display text-3xl mb-2">{products[0].name}</h3>
                  {products[0].short_description && (
                    <p className="font-body text-sm text-surface-container-highest/80 max-w-sm">
                      {products[0].short_description}
                    </p>
                  )}
                </div>
              </a>
            )}

            {/* Vertical stack */}
            <div className="md:col-span-5 flex flex-col gap-6">
              {products.slice(1, 3).map((product, i) => (
                <a
                  key={product.id}
                  href={'/productos/' + product.slug}
                  className={'flex items-center gap-6 p-6 group hover:-translate-y-1 transition-transform duration-300 ambient-shadow ' +
                    (i % 2 === 0 ? 'organic-card-2 bg-surface-variant ml-0' : 'organic-card-3 bg-tertiary-fixed-dim ml-8')}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={product.images?.[0] ?? 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=200&q=80'}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-primary leading-tight mb-1">{product.name}</h4>
                    <p className="font-body text-sm text-on-surface-variant">
                      ${product.price.toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-on-surface-variant">
            <p className="font-display text-2xl italic">Proximos botanicos llegando...</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <a
            href="/tienda"
            className="inline-block px-10 py-4 bg-surface-container-high text-primary rounded-full font-body text-xs uppercase tracking-widest hover:bg-primary-fixed transition-all duration-300 ambient-shadow"
          >
            Ver todos los productos
          </a>
        </div>
      </section>

      {/* ===== WELLNESS SANCTUARY ===== */}
      <section id="wellness" className="mt-16 py-28 bg-primary-container text-surface-container-lowest relative overflow-hidden">
        {/* Botanical backdrop */}
        <div className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&q=80"
            alt="Tropical leaf texture"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Phone mockup */}
          <div className="flex justify-center order-2 md:order-1">
            <div className="w-56 h-[440px] bg-surface rounded-[40px] p-2 ambient-shadow-lg -rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="w-full h-full bg-surface-container rounded-[32px] overflow-hidden relative">
                <Image
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80"
                  alt="Wellness app"
                  fill
                  className="object-cover opacity-50"
                  unoptimized
                />
                <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-surface to-transparent p-5 flex flex-col justify-end">
                  <span className="font-body text-[10px] text-primary uppercase tracking-widest block mb-2">Ritual Diario</span>
                  <div className="h-1.5 w-full bg-surface-variant rounded-full mb-3">
                    <div className="h-full bg-secondary w-1/3 rounded-full" />
                  </div>
                  <p className="font-display text-base text-primary">Calma Nocturna</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2">
            <p className="font-body text-xs uppercase tracking-widest text-inverse-primary mb-4">
              Acceso exclusivo para clientes
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[1.1] mb-6">
              Tu Santuario<br />
              <span className="italic text-inverse-primary">Digital</span>
            </h2>
            <p className="font-body text-lg text-surface-container-lowest/75 mb-8 max-w-md leading-relaxed">
              Extiende tu experiencia sensorial. Nuestra app complementaria guia tus rituales,
              hace seguimiento de tu viaje de bienestar y te conecta con los ritmos naturales.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              {['Meditaciones guiadas', 'Rastreador de habitos', 'Guias de aromaterapia', 'Contenido exclusivo'].map((f) => (
                <span key={f} className="font-body text-xs bg-surface-container-lowest/10 border border-surface-container-lowest/20 rounded-full px-4 py-2 text-surface-container-lowest/80">
                  {f}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="/tienda"
                className="bg-surface text-primary rounded-full px-7 py-3 font-body text-xs uppercase tracking-widest hover:bg-surface-variant transition-colors ambient-shadow"
              >
                Comprar para obtener acceso
              </a>
              <a
                href="/wellness"
                className="border border-surface-container-lowest/30 text-surface-container-lowest rounded-full px-7 py-3 font-body text-xs uppercase tracking-widest hover:bg-surface-container-lowest/10 transition-colors"
              >
                Ya tengo acceso
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOSOTROS ===== */}
      <section id="nosotros" className="py-28 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="organic-card-1 overflow-hidden ambient-shadow aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=900&q=80"
              alt="Naturaleza colombiana"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          {/* Stats floating card */}
          <div className="absolute -bottom-6 -right-6 bg-secondary-fixed rounded-2xl p-5 ambient-shadow hidden md:block">
            <p className="font-display text-3xl text-primary font-semibold">500+</p>
            <p className="font-body text-xs text-on-secondary-container uppercase tracking-wider mt-1">Clientes</p>
          </div>
        </div>
        <div>
          <p className="font-body text-xs uppercase tracking-[0.2em] text-outline mb-4">Nuestra Historia</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary italic mb-6 leading-tight">
            Alma Botanica
          </h2>
          <p className="font-body text-on-surface-variant leading-relaxed mb-6 text-lg">
            Nacimos de la conviccion de que la naturaleza tiene todo lo que necesitamos.
            Recolectamos ingredientes de las montanas colombianas y los transformamos en
            rituales de bienestar que conectan cuerpo, mente y tierra.
          </p>
          <p className="font-body text-on-surface-variant leading-relaxed mb-10">
            Cada producto es resultado de un proceso artesanal que preserva la integridad
            de la planta y su energia vital. Sin quimicos, sin atajos — solo naturaleza en su forma mas pura.
          </p>
          <div className="flex gap-10">
            {[['100%', 'Natural'], ['Artesanal', 'Hecho a mano'], ['Colombia', 'De origen']].map(([val, label]) => (
              <div key={label}>
                <p className="font-display text-2xl text-primary font-semibold">{val}</p>
                <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
