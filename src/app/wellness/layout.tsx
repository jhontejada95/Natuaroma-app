import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { Leaf, BookOpen, Sparkles, LayoutDashboard, LogOut } from 'lucide-react'

const PUBLIC_WELLNESS = ['/wellness/login', '/wellness/activar']

export default async function WellnessLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  if (PUBLIC_WELLNESS.some(p => pathname.startsWith(p))) {
    return <>{children}</>
  }

  const supabase = await createClient()
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/wellness/login')

  const { data: access } = await db
    .from('wellness_access')
    .select('id, activated_at, expires_at, code')
    .eq('user_id', user.id)
    .not('activated_at', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!access) {
    redirect('/wellness/activar')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-surface sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/wellness" className="flex items-center gap-2.5 font-display font-bold text-lg">
            <Leaf size={20} className="text-accent" />
            Natuaroma Wellness
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <a href="/wellness" className="flex items-center gap-2 px-4 py-2 rounded-lg text-surface/80 hover:text-surface hover:bg-white/10 transition-colors text-sm font-medium">
              <LayoutDashboard size={16} />
              Inicio
            </a>
            <a href="/wellness/biblioteca" className="flex items-center gap-2 px-4 py-2 rounded-lg text-surface/80 hover:text-surface hover:bg-white/10 transition-colors text-sm font-medium">
              <BookOpen size={16} />
              Biblioteca
            </a>
            <a href="/wellness/habitos" className="flex items-center gap-2 px-4 py-2 rounded-lg text-surface/80 hover:text-surface hover:bg-white/10 transition-colors text-sm font-medium">
              <Sparkles size={16} />
              Habitos
            </a>
          </nav>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="flex items-center gap-2 px-3 py-2 rounded-lg text-surface/70 hover:text-surface hover:bg-white/10 transition-colors text-sm">
              <LogOut size={15} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </form>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-primary border-t border-white/10 z-50 flex">
        {[
          { href: '/wellness', icon: LayoutDashboard, label: 'Inicio' },
          { href: '/wellness/biblioteca', icon: BookOpen, label: 'Biblioteca' },
          { href: '/wellness/habitos', icon: Sparkles, label: 'Habitos' },
        ].map(({ href, icon: Icon, label }) => (
          <a
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center py-3 text-surface/70 hover:text-surface transition-colors"
          >
            <Icon size={20} />
            <span className="text-[10px] mt-1">{label}</span>
          </a>
        ))}
      </nav>

      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
