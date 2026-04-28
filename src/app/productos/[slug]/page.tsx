import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ArrowLeft, Leaf, Shield, Truck, Star } from 'lucide-react'

const FALLBACK_IMAGES: Record<string, string> = {
  aceites: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=80',
  aromas: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=900&q=80',
  velas: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=900&q=80',
  default: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=900&q=80',
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!product) notFound()

  const categoryName = (product.categories as any)?.name?.toLowerCase() ?? 'default'
  const imageUrl =
    product.images && product.images.length > 0 && product.images[0].startsWith('http')
      ? product.images[0]
      : FALLBACK_IMAGES[categoryName] ?? FALLBACK_IMAGES.default

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <a
          href="/tienda"
          className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Imagen principal */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-dim border border-outline-variant shadow-xl">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {(product.categories as any)?.name && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-surface/95 backdrop-blur-sm text-primary text-xs font-semibold uppercase tracking-widest px-3 py-2 rounded-full shadow-sm">
                    <Leaf size={11} />
                    {(product.categories as any).name}
                  </span>
                </div>
              )}
            </div>

            {/* Galería thumbnail (placeholder para más imágenes) */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.slice(0, 4).map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-dim border-2 border-primary cursor-pointer"
                  >
                    <Image src={img} alt={`Vista ${i + 1}`} fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-8 lg:pt-4">
            <div className="space-y-4">
              {/* Reseñas simuladas */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#c5a96d" className="text-accent" />
                  ))}
                </div>
                <span className="text-sm text-foreground/50">(4.9) · 12 reseñas</span>
              </div>

              <h1 className="font-display text-4xl font-bold text-primary leading-tight">
                {product.name}
              </h1>

              {product.short_description && (
                <p className="text-foreground/70 leading-relaxed text-lg">
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="flex items-baseline gap-3 py-6 border-y border-outline-variant">
              <span className="font-display text-4xl font-bold text-primary">
                ${product.price.toLocaleString('es-CO')}
              </span>
              <span className="text-foreground/50 text-base">COP</span>
            </div>

            {/* Stock */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-foreground/60">
                  {product.stock <= 5
                    ? `¡Solo quedan ${product.stock} unidades!`
                    : 'En stock · Listo para enviar'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-error">
                <div className="w-2 h-2 bg-error rounded-full" />
                Agotado temporalmente
              </div>
            )}

            {/* Botón agregar al carrito */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: imageUrl,
              }}
              disabled={product.stock === 0}
            />

            {/* Garantías */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-outline-variant">
              {[
                { icon: Leaf, title: '100% Natural', desc: 'Sin químicos' },
                { icon: Truck, title: 'Envío nacional', desc: 'A todo Colombia' },
                { icon: Shield, title: 'Compra segura', desc: 'Mercado Pago' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-foreground/50">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
