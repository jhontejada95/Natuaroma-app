import { createClient } from '@/lib/supabase/server'
import { createProduct } from './actions'
import { ArrowLeft, ImageIcon, Info } from 'lucide-react'

const inputClass = 'w-full px-4 py-2.5 bg-surface-dim border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors text-sm'
const labelClass = 'block text-sm font-semibold text-foreground mb-1.5'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name')

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <a href="/admin/products" className="w-9 h-9 flex items-center justify-center rounded-lg border border-outline-variant text-foreground/50 hover:text-primary hover:border-primary transition-colors">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Nuevo Producto</h1>
          <p className="text-foreground/60 mt-1 text-sm">Completa la informacion para publicar en la tienda.</p>
        </div>
      </div>

      <form action={createProduct} className="space-y-6">
        {/* Informacion basica */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-display font-semibold text-primary border-b border-outline-variant pb-3">Informacion basica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClass}>Nombre del Producto</label>
              <input type="text" id="name" name="name" required placeholder="Ej: Aceite Esencial de Lavanda" className={inputClass} />
            </div>
            <div>
              <label htmlFor="slug" className={labelClass}>Slug (URL)</label>
              <input type="text" id="slug" name="slug" required placeholder="aceite-esencial-lavanda" className={`${inputClass} font-mono`} />
            </div>
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Descripcion</label>
            <textarea id="description" name="description" rows={3} placeholder="Describe el producto, sus beneficios y modo de uso..." className={`${inputClass} resize-none`} />
          </div>
        </div>

        {/* Precio e inventario */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-display font-semibold text-primary border-b border-outline-variant pb-3">Precio e inventario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="price" className={labelClass}>Precio (COP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 text-sm font-medium">$</span>
                <input type="number" id="price" name="price" required min="0" step="100" placeholder="45000" className={`${inputClass} pl-7`} />
              </div>
            </div>
            <div>
              <label htmlFor="stock" className={labelClass}>Inventario inicial</label>
              <input type="number" id="stock" name="stock" required min="0" defaultValue="10" className={inputClass} />
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>Estado</label>
              <select id="status" name="status" className={inputClass}>
                <option value="active">Activo - visible en tienda</option>
                <option value="draft">Borrador - oculto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Organizacion */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-6">
          <h2 className="font-display font-semibold text-primary border-b border-outline-variant pb-3">Organizacion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category_id" className={labelClass}>Categoria</label>
              <select id="category_id" name="category_id" className={inputClass}>
                <option value="">Sin categoria</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Imagen */}
        <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
          <h2 className="font-display font-semibold text-primary border-b border-outline-variant pb-3">Imagen del producto</h2>
          <div>
            <label htmlFor="image_url" className={labelClass}>URL de la imagen</label>
            <div className="relative">
              <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input type="url" id="image_url" name="image_url" placeholder="https://ejemplo.com/imagen.jpg" className={`${inputClass} pl-9`} />
            </div>
            <p className="flex items-center gap-1.5 text-xs text-foreground/50 mt-2">
              <Info size={12} />
              Si la dejas vacia, se usara una imagen predeterminada segun la categoria.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-4 pt-2">
          <a href="/admin/products" className="px-6 py-2.5 text-foreground/70 hover:text-foreground font-medium transition-colors border border-outline-variant rounded-lg">
            Cancelar
          </a>
          <button type="submit" className="bg-primary text-surface px-8 py-2.5 rounded-lg hover:bg-primary-container transition-colors font-semibold shadow-sm">
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  )
}
