import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Leaf, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', icon: 'LayoutDashboard', label: 'Dashboard' },
  { href: '/admin/products', icon: 'Package', label: 'Catalogo' },
  { href: '/admin/orders', icon: 'ShoppingCart', label: 'Pedidos' },
  { href: '/admin/wellness', icon: 'Leaf', label: 'Wellness' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="flex h-screen bg-surface-dim font-sans text-foreground">
      <aside className="w-64 bg-surface border-r border-outline-variant flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-outline-variant gap-2">
          <Leaf size={18} className="text-primary" />
          <span className="font-display font-bold text-xl text-primary italic">Natuaroma</span>
          <span className="text-xs text-outline ml-1">admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium text-sm">
            <Package size={18} /> Catalogo
          </a>
          <a href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium text-sm">
            <ShoppingCart size={18} /> Pedidos
          </a>
          <a href="/admin/wellness" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors font-medium text-sm">
            <Leaf size={18} /> Wellness
          </a>
        </nav>

        <div className="p-4 border-t border-outline-variant">
          <form action="/auth/signout" method="POST">
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-error hover:bg-error-container transition-colors font-medium text-left text-sm">
              <LogOut size={18} /> Cerrar sesion
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  )
}
