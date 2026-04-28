import { createClient } from '@/lib/supabase/server'
import { BookOpen, Play, Sparkles, Leaf, Clock } from 'lucide-react'

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  meditation: { label: 'Meditaciones', icon: Play, color: 'bg-indigo-50 text-indigo-600' },
  guide: { label: 'Guias', icon: BookOpen, color: 'bg-green-50 text-green-700' },
  habit: { label: 'Habitos', icon: Sparkles, color: 'bg-amber-50 text-amber-700' },
  video: { label: 'Videos', icon: Play, color: 'bg-rose-50 text-rose-600' },
  recipe: { label: 'Recetas', icon: Leaf, color: 'bg-teal-50 text-teal-700' },
}

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const db = supabase as any

  let query = db
    .from('wellness_content')
    .select('id, type, title, slug, description, duration_minutes, category, thumbnail_url')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (params?.tipo) query = query.eq('type', params.tipo)

  const { data: content } = await query

  // Conteo por tipo
  const { data: allContent } = await db
    .from('wellness_content')
    .select('type')
    .eq('is_published', true)

  const counts: Record<string, number> = {}
  ;(allContent ?? []).forEach((c: any) => {
    counts[c.type] = (counts[c.type] ?? 0) + 1
  })

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Biblioteca de Bienestar</h1>
        <p className="text-foreground/60 mt-1">Todo tu contenido de aromaterapia, meditacion y habitos saludables</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/wellness/biblioteca"
          className={'px-4 py-2 rounded-full text-sm font-medium border transition-colors ' +
            (!params?.tipo
              ? 'bg-primary text-surface border-primary'
              : 'border-outline-variant text-foreground/70 hover:border-primary hover:text-primary')}
        >
          Todo ({(allContent ?? []).length})
        </a>
        {Object.entries(TYPE_CONFIG).map(([type, { label, icon: Icon }]) => (
          counts[type] ? (
            <a
              key={type}
              href={'/wellness/biblioteca?tipo=' + type}
              className={'px-4 py-2 rounded-full text-sm font-medium border transition-colors flex items-center gap-1.5 ' +
                (params?.tipo === type
                  ? 'bg-primary text-surface border-primary'
                  : 'border-outline-variant text-foreground/70 hover:border-primary hover:text-primary')}
            >
              <Icon size={13} />
              {label} ({counts[type]})
            </a>
          ) : null
        ))}
      </div>

      {/* Grid de contenido */}
      {(!content || content.length === 0) ? (
        <div className="text-center py-24 text-foreground/30 space-y-3">
          <BookOpen size={48} className="mx-auto opacity-20" />
          <p className="text-lg">Contenido llegando pronto</p>
          <p className="text-sm">Estamos preparando guias y meditaciones para ti</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.map((item: any) => {
            const cfg = TYPE_CONFIG[item.type] ?? { label: item.type, icon: BookOpen, color: 'bg-surface-dim text-foreground' }
            const Icon = cfg.icon
            return (
              <a
                key={item.id}
                href={'/wellness/biblioteca/' + item.slug}
                className="group bg-surface rounded-2xl border border-outline-variant overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail o placeholder */}
                <div className={'h-36 flex items-center justify-center ' + cfg.color}>
                  <Icon size={40} className="opacity-30" />
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-center justify-between">
                    <span className={'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ' + cfg.color}>
                      <Icon size={11} />
                      {cfg.label}
                    </span>
                    {item.duration_minutes && (
                      <span className="flex items-center gap-1 text-xs text-foreground/40">
                        <Clock size={11} />
                        {item.duration_minutes} min
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary group-hover:text-primary-container transition-colors leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-foreground/50 mt-1.5 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.category && (
                    <p className="text-xs text-foreground/30 mt-auto uppercase tracking-wider">{item.category}</p>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
