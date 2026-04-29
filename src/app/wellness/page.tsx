import { createClient } from '@/lib/supabase/server'
import { BookOpen, Sparkles, Flame, Play, CheckCircle, ArrowRight, Leaf } from 'lucide-react'
import { WellnessPWABanner } from '@/components/wellness/WellnessPWABanner'

export default async function WellnessDashboardPage() {
  const supabase = await createClient()
  const db = supabase as any

  const { data: { user } } = await supabase.auth.getUser()

  // Obtener acceso
  const { data: access } = await db
    .from('wellness_access')
    .select('id, activated_at, expires_at')
    .eq('user_id', user!.id)
    .not('activated_at', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  // Contenido destacado
  const { data: featured } = await db
    .from('wellness_content')
    .select('id, type, title, slug, description, duration_minutes, category')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  // Habitos de hoy
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { data: todayHabits } = await db
    .from('user_habits')
    .select('id, habit_name, streak_count')
    .eq('user_id', user!.id)
    .gte('completed_at', today.toISOString())

  const todayHabitNames = new Set((todayHabits ?? []).map((h: any) => h.habit_name))

  // Racha total
  const { data: allHabits } = await db
    .from('user_habits')
    .select('completed_at')
    .eq('user_id', user!.id)
    .order('completed_at', { ascending: false })
    .limit(30)

  const diasActivos = new Set(
    (allHabits ?? []).map((h: any) => new Date(h.completed_at).toDateString())
  ).size

  const typeIcons: Record<string, any> = {
    meditation: Play,
    guide: BookOpen,
    habit: Sparkles,
    video: Play,
    recipe: Leaf,
  }

  const typeLabels: Record<string, string> = {
    meditation: 'Meditacion',
    guide: 'Guia',
    habit: 'Habito',
    video: 'Video',
    recipe: 'Receta',
  }

  const DAILY_HABITS = ['Respiracion consciente', 'Aromaterapia manana', 'Hidratacion', 'Momento de calma']

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      <WellnessPWABanner />
      {/* Saludo */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-primary">Bienvenido a tu espacio</h1>
        <p className="text-foreground/60">Que el bienestar natural guie tu dia de hoy.</p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Dias activo', value: diasActivos, icon: Flame, color: 'text-accent' },
          { label: 'Habitos hoy', value: todayHabits?.length ?? 0, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Contenido', value: featured?.length ?? 0, icon: BookOpen, color: 'text-primary' },
          { label: 'Racha', value: diasActivos + ' dias', icon: Sparkles, color: 'text-accent' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface rounded-2xl border border-outline-variant p-5 space-y-2">
            <Icon size={20} className={color} />
            <p className={'text-2xl font-display font-bold text-primary'}>{value}</p>
            <p className="text-xs text-foreground/50 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Habitos de hoy */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-primary">Habitos de hoy</h2>
          <a href="/wellness/habitos" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DAILY_HABITS.map((habit) => {
            const done = todayHabitNames.has(habit)
            return (
              <div
                key={habit}
                className={'flex items-center gap-4 p-4 rounded-xl border transition-colors ' +
                  (done
                    ? 'bg-primary-fixed border-primary/20'
                    : 'bg-surface border-outline-variant')}
              >
                <div className={'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ' +
                  (done ? 'bg-primary text-surface' : 'bg-surface-dim text-foreground/30')}>
                  <CheckCircle size={18} />
                </div>
                <span className={'font-medium text-sm ' + (done ? 'text-primary' : 'text-foreground/70 line-through-' + (done ? 'none' : ''))}>
                  {habit}
                </span>
                {done && <span className="ml-auto text-xs text-primary/60 font-medium">Listo</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Contenido recomendado */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-primary">Biblioteca</h2>
          <a href="/wellness/biblioteca" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            Ver todo <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(featured ?? []).map((item: any) => {
            const Icon = typeIcons[item.type] ?? BookOpen
            return (
              <a
                key={item.id}
                href={'/wellness/biblioteca/' + item.slug}
                className="group bg-surface rounded-2xl border border-outline-variant p-5 space-y-3 hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-primary-fixed rounded-xl flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/40 uppercase tracking-wider bg-surface-dim px-2.5 py-1 rounded-full">
                    {typeLabels[item.type] ?? item.type}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary group-hover:text-primary-container transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-foreground/50 mt-1 line-clamp-2">{item.description}</p>
                  )}
                </div>
                {item.duration_minutes && (
                  <p className="text-xs text-foreground/40">{item.duration_minutes} min</p>
                )}
              </a>
            )
          })}
        </div>

        {(!featured || featured.length === 0) && (
          <div className="text-center py-16 text-foreground/30 space-y-2">
            <BookOpen size={40} className="mx-auto opacity-30" />
            <p>El contenido llegara pronto</p>
          </div>
        )}
      </div>
    </div>
  )
}
