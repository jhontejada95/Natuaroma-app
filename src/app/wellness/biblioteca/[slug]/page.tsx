import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, BookOpen, Play, Sparkles, Leaf } from 'lucide-react'

const TYPE_CONFIG: Record<string, { label: string; icon: any }> = {
  meditation: { label: 'Meditacion', icon: Play },
  guide: { label: 'Guia', icon: BookOpen },
  habit: { label: 'Habito', icon: Sparkles },
  video: { label: 'Video', icon: Play },
  recipe: { label: 'Receta', icon: Leaf },
}

export default async function ContenidoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const db = supabase as any

  const { data: item } = await db
    .from('wellness_content')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!item) notFound()

  const cfg = TYPE_CONFIG[item.type] ?? { label: item.type, icon: BookOpen }
  const Icon = cfg.icon

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <a
        href="/wellness/biblioteca"
        className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Volver a la biblioteca
      </a>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-fixed text-primary">
            <Icon size={12} />
            {cfg.label}
          </span>
          {item.duration_minutes && (
            <span className="flex items-center gap-1 text-sm text-foreground/40">
              <Clock size={13} />
              {item.duration_minutes} minutos
            </span>
          )}
        </div>
        <h1 className="text-3xl font-display font-bold text-primary leading-tight">{item.title}</h1>
        {item.description && (
          <p className="text-foreground/60 text-lg leading-relaxed">{item.description}</p>
        )}
      </div>

      {/* Media (audio/video embed) */}
      {item.media_url && (
        <div className="rounded-2xl overflow-hidden bg-surface-dim border border-outline-variant">
          {item.media_url.includes('youtube') || item.media_url.includes('youtu.be') ? (
            <iframe
              src={item.media_url.replace('watch?v=', 'embed/')}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : item.media_url.match(/\.(mp3|wav|ogg)$/) ? (
            <div className="p-6">
              <audio controls className="w-full">
                <source src={item.media_url} />
              </audio>
            </div>
          ) : (
            <a
              href={item.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-6 hover:bg-surface-container transition-colors"
            >
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Play size={20} className="text-surface" />
              </div>
              <span className="font-medium text-primary">Reproducir contenido</span>
            </a>
          )}
        </div>
      )}

      {/* Cuerpo del contenido */}
      {item.content_body && (
        <div className="bg-surface rounded-2xl border border-outline-variant p-8">
          <div className="prose prose-stone max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm">
            {item.content_body}
          </div>
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-surface-dim text-foreground/50 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
