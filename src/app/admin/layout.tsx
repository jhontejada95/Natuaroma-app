import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package, ShoppingCart, Settings, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-surface-dim font-sans text-foreground">
      <aside className="w-64 bg-surface border-r border-outline-variant flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-outline-variant">
          <span className="font-display font-bold text-xl text-primary">Admin Natuaroma</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded bg-primary-fixed text-primary-fixed-variant font-medium"
          >
            <Package size={20} />
            Catalogo
          </a>
          <a
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded text-foreground/70 hover:bg-surface-container hover:text-primary transition-colors"
          >
            <ShoppingCart size={20} />
            Pedidos
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded text-foreground/70 hover:bg-surface-container hover:text-primary transition-colors"
          >
            <Settings size={20} />
            Configuracion
          </a>
        </nav>
        <div className="p-4 border-t border-outline-variant">
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-3 px-4 py-3 w-full rounded text-error hover:bg-error-container transition-colors font-medium text-left"
            >
              <LogOut size={20} />
              Cerrar sesion
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  )
}
