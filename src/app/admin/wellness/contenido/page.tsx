import { createClient } from '@/lib/supabase/server'
import { BookOpen, Eye, EyeOff, Plus } from 'lucide-react'
import { toggleContentPublished, createWellnessContent } from './actions'

const TYPE_LABELS: Record<string, string> = {
  meditation: 'Meditacion',
  guide: 'Guia',
  habit: 'Habito',
  video: 'Video',
  recipe: 'Receta',
}

export default async function WellnessContenidoPage() {
  const supabase = await createClient()
  const db = supabase as any

  const { data: content } = await db
    .from('wellness_content')
    .select('id, title, type, slug, is_published, duration_minutes, sort_order, created_at')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Contenido Wellness</h1>
          <p className="text-on-surface-variant mt-1 text-sm">Gestiona meditaciones, guias y habitos</p>
        </div>
      </div>

      {/* Formulario crear contenido */}
      <details className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <summary className="px-6 py-4 cursor-pointer flex items-center gap-2 font-semibold text-primary hover:bg-surface-dim transition-colors">
          <Plus size={16} />
          Agregar nuevo contenido
        </summary>
        <form action={createWellnessContent} className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Titulo</label>
            <input name="title" required className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background" />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Slug (URL)</label>
            <input name="slug" required placeholder="mi-meditacion-de-manana" className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background font-mono" />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Tipo</label>
            <select name="type" required className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background">
              {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Duracion (min)</label>
            <input name="duration_minutes" type="number" className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background" />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Categoria</label>
            <input name="category" placeholder="respiracion, sueno, enfoque..." className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background" />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">URL YouTube (opcional)</label>
            <input name="youtube_url" type="url" placeholder="https://youtu.be/..." className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background" />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">URL Audio (opcional)</label>
            <input name="audio_url" type="url" className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background" />
          </div>
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Orden</label>
            <input name="sort_order" type="number" defaultValue="99" className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Descripcion corta</label>
            <textarea name="description" rows={2} className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">Cuerpo / Guia (texto)</label>
            <textarea name="body" rows={5} placeholder="Escribe el contenido de la guia, instrucciones de la meditacion, etc." className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-background resize-none" />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input type="checkbox" name="is_published" id="is_published" value="true" className="w-4 h-4" />
            <label htmlFor="is_published" className="text-sm text-on-surface">Publicar inmediatamente</label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-primary text-surface rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-primary-container transition-colors">
              Crear contenido
            </button>
          </div>
        </form>
      </details>

      {/* Tabla */}
      <div className="bg-surface rounded-2xl border border-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          <h2 className="font-semibold text-primary">{content?.length ?? 0} contenidos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                {['#', 'Titulo', 'Tipo', 'Duracion', 'Estado', 'Accion'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(content ?? []).map((c: any) => (
                <tr key={c.id} className="border-b border-outline-variant/50 hover:bg-surface-dim/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-outline">{c.sort_order}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-sm text-primary">{c.title}</p>
                      <p className="text-xs text-outline font-mono mt-0.5">{c.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold bg-primary-fixed text-primary px-2.5 py-1 rounded-full">
                      {TYPE_LABELS[c.type] ?? c.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {c.duration_minutes ? `${c.duration_minutes} min` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {c.is_published ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
                        <Eye size={11} /> Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant bg-surface-dim px-2.5 py-1 rounded-full">
                        <EyeOff size={11} /> Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <form action={toggleContentPublished.bind(null, c.id, !c.is_published)}>
                      <button type="submit" className="text-xs text-primary hover:underline font-medium">
                        {c.is_published ? 'Despublicar' : 'Publicar'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!content || content.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                    No hay contenido todavia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
