import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros — Natuaroma',
  description: 'Conoce la historia de Natuaroma, marca colombiana de bienestar artesanal. 100% natural, hecho con amor.',
}

const VALUES = [
  {
    icon: '🌿',
    title: '100% Natural',
    desc: 'Cada ingrediente es cuidadosamente seleccionado de la naturaleza colombiana, sin químicos ni atajos.',
  },
  {
    icon: '🤲',
    title: 'Artesanal',
    desc: 'Elaboramos cada producto a mano, en pequeños lotes, para garantizar la máxima calidad e intención.',
  },
  {
    icon: '🇨🇴',
    title: 'Hecho en Colombia',
    desc: 'Nos enorgullece ser una marca colombiana que rescata saberes ancestrales de nuestras montañas.',
  },
  {
    icon: '♻️',
    title: 'Sostenible',
    desc: 'Empaque biodegradable, procesos de bajo impacto y apoyo a comunidades locales de recolectores.',
  },
]

const STATS = [
  { value: '100%', label: 'Natural' },
  { value: '500+', label: 'Clientes felices' },
  { value: '3+', label: 'Años de historia' },
  { value: '20+', label: 'Productos únicos' },
]

export default function NosotrosPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative py-32 px-6 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&q=80"
            alt="Botanicos colombianos"
            fill className="object-cover"
            unoptimized
          />
        </div>
        <div className="absolute top-10 left-10 w-48 h-48 bg-secondary-fixed/10 organic-blob blur-2xl" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-primary-fixed/10 organic-blob blur-3xl" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-inverse-primary mb-4">Nuestra Historia</p>
          <h1 className="font-display text-5xl md:text-7xl italic text-surface leading-[1.1] mb-6">
            Alma Botánica
          </h1>
          <p className="font-body text-xl text-surface/70 max-w-2xl mx-auto leading-relaxed">
            Nacimos de la convicción de que la naturaleza colombiana tiene todo lo que necesitamos
            para vivir en equilibrio.
          </p>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 px-6 bg-surface-container-low">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-4xl text-primary font-semibold mb-1">{value}</p>
              <p className="font-body text-xs uppercase tracking-widest text-on-surface-variant">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HISTORIA ===== */}
      <section className="py-28 px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="organic-card-1 overflow-hidden ambient-shadow aspect-[4/5]">
            <Image
              src="https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=900&q=80"
              alt="Proceso artesanal Natuaroma"
              fill className="object-cover"
              unoptimized
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-secondary-fixed rounded-2xl p-5 ambient-shadow hidden md:block">
            <p className="font-display text-2xl text-primary font-semibold">2021</p>
            <p className="font-body text-xs text-on-secondary-container uppercase tracking-wider mt-1">Fundada</p>
          </div>
        </div>
        <div className="space-y-6">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-outline">Nuestros orígenes</p>
          <h2 className="font-display text-4xl md:text-5xl text-primary italic leading-tight">
            De las montañas<br />colombianas, con amor
          </h2>
          <p className="font-body text-on-surface-variant leading-relaxed text-lg">
            Natuaroma nació en el corazón de Colombia, inspirada por la increíble biodiversidad
            de nuestras montañas y el conocimiento ancestral de las comunidades que las habitan.
          </p>
          <p className="font-body text-on-surface-variant leading-relaxed">
            Comenzamos elaborando aceites esenciales puros en una pequeña cocina, con la convicción
            de que cada persona merece acceder a remedios naturales auténticos. Hoy, años después,
            seguimos fieles a ese principio: nada de químicos, nada de atajos, solo naturaleza
            en su forma más pura.
          </p>
          <p className="font-body text-on-surface-variant leading-relaxed">
            Cada producto es resultado de un proceso artesanal que preserva la integridad de la planta,
            su energía vital y su conexión con la tierra que le dio vida.
          </p>
        </div>
      </section>

      {/* ===== VALORES ===== */}
      <section className="py-28 px-6 md:px-16 bg-primary-container relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&q=80"
            alt="Naturaleza"
            fill className="object-cover"
            unoptimized
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-inverse-primary mb-3">Lo que nos mueve</p>
            <h2 className="font-display text-4xl md:text-5xl italic text-surface">Nuestros Valores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-surface-container-lowest/10 backdrop-blur-sm border border-surface/10 rounded-2xl p-7 space-y-3"
              >
                <span className="text-4xl block">{icon}</span>
                <h3 className="font-display text-xl text-surface">{title}</h3>
                <p className="font-body text-sm text-surface/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESO ===== */}
      <section className="py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-[0.2em] text-outline mb-3">Cómo lo hacemos</p>
          <h2 className="font-display text-4xl md:text-5xl italic text-primary">El Proceso</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Recolección',
              desc: 'Seleccionamos ingredientes de productores locales colombianos que cultivan de forma orgánica y sostenible.',
              img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=80',
            },
            {
              step: '02',
              title: 'Elaboración',
              desc: 'Cada producto se elabora a mano en pequeños lotes, manteniendo temperaturas y tiempos precisos para preservar propiedades.',
              img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
            },
            {
              step: '03',
              title: 'Tu hogar',
              desc: 'Empacamos con materiales biodegradables y enviamos con cuidado para que llegue perfecto a tus manos.',
              img: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600&q=80',
            },
          ].map(({ step, title, desc, img }) => (
            <div key={step} className="space-y-5">
              <div className="organic-card-2 overflow-hidden aspect-[4/3]">
                <Image src={img} alt={title} fill className="object-cover" unoptimized />
              </div>
              <div>
                <p className="font-body text-xs text-outline mb-2">{step}</p>
                <h3 className="font-display text-2xl text-primary italic mb-2">{title}</h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 px-6 text-center bg-surface-container-low">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-4xl italic text-primary">Sé parte del ritual</h2>
          <p className="font-body text-on-surface-variant leading-relaxed">
            Cada compra apoya a productores colombianos y un proceso artesanal hecho con intención.
          </p>
          <a
            href="/tienda"
            className="inline-block bg-secondary-fixed text-on-secondary-fixed rounded-full px-10 py-4 font-body text-xs uppercase tracking-widest hover:bg-secondary-fixed-dim hover:scale-105 transition-all duration-300 ambient-shadow"
          >
            Explorar botánicos
          </a>
        </div>
      </section>

    </div>
  )
}
