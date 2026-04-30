import { createAdminClient } from '@/lib/supabase/admin'
import { Flame, CheckCircle, Plus } from 'lucide-react'
import { toggleHabit } from './actions'

const HABITS = [
  { name: 'Respiracion consciente', desc: '5 min de respiracion profunda con aceite esencial', emoji: '🌬' },
  { name: 'Aromaterapia manana', desc: 'Difusor encendido al despertar', emoji: '🌿' },
  { name: 'Hidratacion', desc: '8 vasos de agua al dia', emoji: '💧' },
  { name: 'Momento de calma', desc: '10 min sin pantallas con vela aromatica', emoji: '🕯' },
  { name: 'Gratitud', desc: 'Escribe 3 cosas por las que eres agradecido', emoji: '✨' },
  { name: 'Movimiento', desc: '20 min de actividad fisica suave', emoji: '🍃' },
]

export default async function HabitosPage() {
  const supabase = createAdminClient()
  const db = supabase

  const { data: { user } } = await supabase.auth.getUser()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayHabits } = await db
    .from('user_habits')
    .select('id, habit_name, completed_at, streak_count')
    .eq('user_id', user!.id)
    .gte('completed_at', today.toISOString())

  const todaySet = new Set((todayHabits ?? []).map((h: any) => h.habit_name))

  // Historial ultimos 7 dias para el calendario
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)

  const { data: weekHabits } = await db
    .from('user_habits')
    .select('completed_at, habit_name')
    .eq('user_id', user!.id)
    .gte('completed_at', sevenDaysAgo.toISOString())

  // Dias con al menos 1 habito completado
  const activeDays = new Set(
    (weekHabits ?? []).map((h: any) => new Date(h.completed_at).toDateString())
  )

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    return d
  })

  const completedToday = todaySet.size
  const totalHabits = HABITS.length

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">
      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold text-primary">Habitos Diarios</h1>
        <p className="text-foreground/60">Construye tu rutina de bienestar un dia a la vez</p>
      </div>

      {/* Progreso de hoy */}
      <div className="bg-primary rounded-2xl p-6 text-surface space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-surface/60 text-sm uppercase tracking-wider">Progreso de hoy</p>
            <p className="text-4xl font-display font-bold mt-1">{completedToday}/{totalHabits}</p>
          </div>
          <div className="w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#c5a96d" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(completedToday / totalHabits) * 100} 100`}
              />
            </svg>
          </div>
        </div>
        {/* Semana */}
        <div className="flex gap-2">
          {weekDays.map((day) => {
            const isActive = activeDays.has(day.toDateString())
            const isToday = day.toDateString() === new Date().toDateString()
            return (
              <div key={day.toISOString()} className="flex-1 text-center">
                <p className="text-xs text-surface/40 mb-1.5">
                  {day.toLocaleDateString('es-CO', { weekday: 'narrow' })}
                </p>
                <div className={'w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-semibold ' +
                  (isToday
                    ? 'bg-accent text-primary'
                    : isActive
                    ? 'bg-white/20 text-surface'
                    : 'bg-white/5 text-surface/30')}>
                  {isActive ? <Flame size={14} /> : day.getDate()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Lista de habitos */}
      <div className="space-y-3">
        <h2 className="font-semibold text-primary text-lg">Lista de hoy</h2>
        {HABITS.map((habit) => {
          const done = todaySet.has(habit.name)
          const toggleAction = toggleHabit.bind(null, habit.name, !done)
          return (
            <form key={habit.name} action={toggleAction}>
              <button
                type="submit"
                className={'w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ' +
                  (done
                    ? 'bg-primary-fixed border-primary/20'
                    : 'bg-surface border-outline-variant hover:border-primary/30 hover:shadow-sm')}
              >
                <div className={'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ' +
                  (done ? 'bg-primary text-surface' : 'bg-surface-dim')}>
                  {done ? <CheckCircle size={20} /> : habit.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={'font-semibold text-sm ' + (done ? 'text-primary' : 'text-foreground')}>
                    {habit.name}
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5 truncate">{habit.desc}</p>
                </div>
                {!done && (
                  <Plus size={18} className="text-foreground/30 flex-shrink-0" />
                )}
                {done && (
                  <span className="text-xs font-semibold text-primary/60 flex-shrink-0">Listo</span>
                )}
              </button>
            </form>
          )
        })}
      </div>
    </div>
  )
}
