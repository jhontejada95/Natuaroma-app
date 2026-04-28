import { createClient } from '@/lib/supabase/server'
import { Plus, Edit3, Trash2 } from 'lucide-react'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  // Fetch products with their categories
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Catálogo de Productos</h1>
          <p className="text-foreground/60 mt-1">Gestiona tu inventario, precios y descripciones.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-surface px-6 py-3 rounded hover:bg-primary-container transition-colors font-medium">
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-surface rounded-lg border border-outline-variant overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-dim border-b border-outline-variant text-foreground/70 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Producto</th>
              <th className="px-6 py-4 font-medium">Categoría</th>
              <th className="px-6 py-4 font-medium">Precio</th>
              <th className="px-6 py-4 font-medium">Stock</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-primary">{product.name}</div>
                  <div className="text-foreground/50 text-xs mt-1">{product.slug}</div>
                </td>
                <td className="px-6 py-4 text-foreground/80">
                  {/* @ts-ignore */}
                  {product.categories?.name || 'Sin Categoría'}
                </td>
                <td className="px-6 py-4 font-medium">
                  ${product.price.toLocaleString('es-CO')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 10 ? 'bg-primary-fixed text-primary-fixed-variant' : 'bg-error-container text-on-error-container'}`}>
                    {product.stock} unds
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`capitalize px-2 py-1 rounded text-xs font-medium ${product.status === 'active' ? 'bg-secondary-fixed text-secondary-fixed-variant' : 'bg-surface-dim text-foreground/60'}`}>
                    {product.status === 'active' ? 'Activo' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-foreground/50 hover:text-primary transition-colors" title="Editar">
                    <Edit3 size={18} />
                  </button>
                  <button className="text-foreground/50 hover:text-error transition-colors" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-foreground/50">
                  No hay productos en el catálogo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
