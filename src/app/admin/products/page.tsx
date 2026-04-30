import { createAdminClient } from '@/lib/supabase/admin'
import { Plus, Package, Edit3 } from 'lucide-react'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Catalogo de Productos</h1>
          <p className="text-foreground/60 mt-1 text-sm">
            {products?.length ?? 0} producto{(products?.length ?? 0) !== 1 ? 's' : ''} en total
          </p>
        </div>
        <a
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-primary text-surface px-6 py-3 rounded-lg hover:bg-primary-container transition-colors font-medium shadow-sm"
        >
          <Plus size={18} />
          Nuevo Producto
        </a>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-dim border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-4 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-4 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-4 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-foreground/60 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-semibold text-foreground/60 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-surface-dim/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-primary">{product.name}</div>
                  <div className="text-foreground/40 text-xs mt-0.5 font-mono">{product.slug}</div>
                </td>
                <td className="px-6 py-4 text-foreground/70">
                  {(product.categories as any)?.name ?? (
                    <span className="text-foreground/30 italic">Sin categoria</span>
                  )}
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  ${product.price.toLocaleString('es-CO')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    product.stock > 10
                      ? 'bg-primary-fixed text-primary-fixed-variant'
                      : product.stock > 0
                      ? 'bg-accent-light text-secondary'
                      : 'bg-error-container text-on-error-container'
                  }`}>
                    {product.stock} unds
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                    product.status === 'active'
                      ? 'bg-secondary-fixed text-secondary-fixed-variant'
                      : 'bg-surface-container text-foreground/50'
                  }`}>
                    {product.status === 'active' ? 'Activo' : 'Borrador'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-primary px-3 py-1.5 rounded-lg hover:bg-primary-fixed transition-colors"
                    >
                      <Edit3 size={14} />
                      Editar
                    </a>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}

            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-foreground/40">
                    <Package size={40} className="opacity-30" />
                    <p className="font-medium">No hay productos aun</p>
                    <a href="/admin/products/new" className="text-primary text-sm font-semibold hover:underline">
                      Crear el primero
                    </a>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
