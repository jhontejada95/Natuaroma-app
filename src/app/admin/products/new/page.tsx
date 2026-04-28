import { createClient } from '@/lib/supabase/server'
import { createProduct } from './actions'
import { ArrowLeft } from 'lucide-react'

export default async function NewProductPage() {
  const supabase = await createClient()

  // Fetch categories for the dropdown
  const { data: categories } = await supabase.from('categories').select('id, name')

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <a href="/admin/products" className="text-foreground/50 hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </a>
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Nuevo Producto</h1>
          <p className="text-foreground/60 mt-1">Añade un nuevo ítem a tu catálogo de bienestar.</p>
        </div>
      </div>

      <form action={createProduct} className="bg-surface rounded-lg border border-outline-variant p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-foreground">Nombre del Producto</label>
            <input type="text" id="name" name="name" required className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-foreground">Slug (URL amigable)</label>
            <input type="text" id="slug" name="slug" required placeholder="ej-aceite-de-lavanda" className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-foreground">Precio (COP)</label>
            <input type="number" id="price" name="price" required min="0" step="100" className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium text-foreground">Inventario Inicial</label>
            <input type="number" id="stock" name="stock" required min="0" defaultValue="10" className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors" />
          </div>

          <div className="space-y-2">
            <label htmlFor="category_id" className="block text-sm font-medium text-foreground">Categoría</label>
            <select id="category_id" name="category_id" required className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors">
              <option value="">Selecciona una categoría...</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium text-foreground">Estado</label>
            <select id="status" name="status" className="w-full px-4 py-2 bg-surface-dim border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors">
              <option value="active">Activo (Visible en tienda)</option>
              <option value="draft">Borrador (Oculto)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant flex justify-end gap-4">
          <a href="/admin/products" className="px-6 py-2 text-foreground/70 hover:text-foreground font-medium transition-colors">Cancelar</a>
          <button type="submit" className="bg-primary text-surface px-8 py-2 rounded hover:bg-primary-container transition-colors font-medium">
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  )
}
