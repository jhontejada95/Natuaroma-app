import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch only active products
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name
      )
    `)
    .eq('status', 'active')
    .limit(3); // Mostramos 3 como "Esenciales"

  return (
    <div className="flex flex-col gap-24 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Placeholder gradient mimicking a premium natural image */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto space-y-8">
          <h1 className="font-display text-5xl md:text-6xl font-medium text-surface tracking-tight">
            Natuaroma: Tu Ritual de Bienestar
          </h1>
          <p className="text-lg md:text-xl text-surface/80 font-light">
            Esencias, aromas y productos naturales para acompañar tu cuerpo, tu hogar y tus sentidos.
          </p>
          <button className="bg-surface text-primary px-8 py-4 rounded hover:bg-surface-dim transition-colors font-medium text-lg shadow-sm">
            Comprar Ahora
          </button>
        </div>
      </section>

      {/* Featured Products Section - Tienda */}
      <section className="max-w-7xl mx-auto px-6 w-full space-y-12">
        <div className="text-center space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-medium text-primary tracking-tight">
            Nuestros Esenciales
          </h2>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Descubre nuestra selección de aceites y aromas diseñados para elevar tu frecuencia y calmar tu mente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </section>

      {/* Wellness App Bridge Section */}
      <section className="bg-secondary/10 py-24">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-display text-3xl md:text-5xl font-medium text-secondary tracking-tight">
            Más que una Tienda:<br />Tu Compañero de Bienestar
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Lleva tus rituales al siguiente nivel con nuestra <strong>Wellness App</strong>. Un espacio dedicado a tu educación, seguimiento de hábitos y meditaciones guiadas, diseñadas para conectar contigo.
          </p>
          <button className="bg-secondary text-surface px-8 py-4 rounded hover:bg-[#793f29] transition-colors font-medium text-lg shadow-sm">
            Descubre la App
          </button>
        </div>
      </section>
    </div>
  );
}
