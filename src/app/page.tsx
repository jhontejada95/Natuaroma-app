import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, Leaf, Star, Shield, Truck } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('status', 'active')
    .limit(4);

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden bg-primary">
        <Image
          src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1800&q=80"
          alt="Productos naturales Natuaroma"
          fill
          className="object-cover opacity-30"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-24">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-surface/10 border border-surface/20 rounded-full px-4 py-2 text-surface/80 text-sm font-medium backdrop-blur-sm">
              <Leaf size={14} className="text-accent" />
              Productos 100% naturales
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-surface leading-tight tracking-tight">
              Tu ritual de<br />
              <span className="text-accent">bienestar</span><br />
              comienza aqui
            </h1>

            <p className="text-lg text-surface/75 leading-relaxed max-w-md">
              Esencias, aceites y aromas naturales para elevar tu energia, calmar tu mente y transformar tu hogar.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/tienda"
                className="inline-flex items-center gap-2 bg-surface text-primary font-semibold px-8 py-4 rounded-full hover:bg-surface-dim transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                Ver Catalogo
                <ArrowRight size={18} />
              </a>
              <a
                href="#nosotros"
                className="inline-flex items-center gap-2 border border-surface/40 text-surface font-medium px-8 py-4 rounded-full hover:bg-surface/10 transition-all text-base"
              >
                Conoce la marca
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-surface/40 text-xs">
          <div className="w-px h-10 bg-surface/30" />
          Descubrir
        </div>
      </section>

      {/* PILARES */}
      <section className="bg-surface border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Leaf, title: "100% Natural", desc: "Sin quimicos ni conservantes artificiales" },
            { icon: Truck, title: "Envio Nacional", desc: "A toda Colombia de forma rapida y segura" },
            { icon: Shield, title: "Compra Protegida", desc: "Pago seguro mediante Mercado Pago" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-dim transition-colors">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{title}</p>
                <p className="text-foreground/60 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-6 w-full py-24 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Coleccion</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary tracking-tight">
              Nuestros Esenciales
            </h2>
            <p className="text-foreground/60 max-w-lg leading-relaxed">
              Cada producto es formulado con intencion. Aceites, aromas y esencias para elevar tu frecuencia diaria.
            </p>
          </div>
          <a
            href="/tienda"
            className="inline-flex items-center gap-2 text-primary font-semibold border-b-2 border-primary pb-1 hover:border-secondary hover:text-secondary transition-colors whitespace-nowrap"
          >
            Ver todo el catalogo
            <ArrowRight size={16} />
          </a>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-foreground/40">
            <Leaf size={48} className="mx-auto mb-4 opacity-30" />
            <p>El catalogo esta en preparacion. Vuelve pronto.</p>
          </div>
        )}
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="bg-surface-dim">
        <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=900&q=80"
              alt="Esencia natural Natuaroma"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-6 left-6 bg-surface/95 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#c5a96d" className="text-accent" />
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">4.9 / 5.0</p>
                <p className="text-xs text-foreground/60">+200 clientes felices</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-secondary">Nuestra historia</span>
              <h2 className="font-display text-4xl font-bold text-primary leading-tight">
                Nacidos del amor por la naturaleza
              </h2>
            </div>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                Natuaroma nacio de la conviccion de que el bienestar verdadero viene de la naturaleza. Cada formula es el resultado de seleccion cuidadosa de ingredientes puros, sin compromisos.
              </p>
              <p>
                Creemos que tu hogar y tu cuerpo merecen lo mejor: aromas que elevan, esencias que sanan y rituales que conectan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                { num: "100%", label: "Ingredientes naturales" },
                { num: "+30", label: "Productos en catalogo" },
                { num: "200+", label: "Clientes satisfechos" },
                { num: "0", label: "Quimicos daninos" },
              ].map(({ num, label }) => (
                <div key={label} className="space-y-1">
                  <p className="font-display text-3xl font-bold text-primary">{num}</p>
                  <p className="text-sm text-foreground/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WELLNESS APP CTA */}
      <section id="bienestar" className="relative overflow-hidden bg-secondary py-28">
        <Image
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1800&q=80"
          alt="Bienestar Natuaroma"
          fill
          className="object-cover opacity-20"
          unoptimized
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-surface/60">Proximamente</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-surface leading-tight">
            Mas que una tienda:<br />Tu companero de bienestar
          </h2>
          <p className="text-lg text-surface/75 leading-relaxed">
            Lleva tus rituales al siguiente nivel con la <strong className="text-surface">Natuaroma Wellness App</strong>: meditaciones guiadas, seguimiento de habitos y educacion sobre aromaterapia.
          </p>
          <button className="bg-surface text-secondary font-semibold px-8 py-4 rounded-full hover:bg-surface-dim transition-all shadow-lg text-base">
            Notificame cuando llegue
          </button>
        </div>
      </section>

    </div>
  );
}
