import { Leaf } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WellnessPasswordLogin } from '@/components/wellness/WellnessPasswordLogin'

export default async function WellnessLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; email?: string; welcome?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect(params?.next ?? '/wellness')

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
            <Leaf size={32} className="text-accent" />
          </div>
          <h1 className="text-3xl font-display font-bold text-surface">Natuaroma Wellness</h1>
          <p className="text-surface/60">Tu espacio de bienestar natural</p>
        </div>

        {params?.error && (
          <div className="bg-error/20 text-surface border border-error/30 rounded-xl p-4 text-sm text-center">
            {params.error}
          </div>
        )}

        <WellnessPasswordLogin
          next={params?.next ?? '/wellness'}
          email={params?.email ?? ''}
          welcome={params?.welcome === '1'}
        />

        <div className="text-center space-y-2">
          <p className="text-surface/40 text-sm">No tienes acceso aun?</p>
          <a href="/wellness/activar" className="text-accent text-sm font-medium hover:underline">
            Activar con codigo Early Access &rarr;
          </a>
          <br />
          <a href="/tienda" className="text-surface/40 text-xs hover:text-surface/60 transition-colors">
            Volver a la tienda
          </a>
        </div>
      </div>
    </div>
  )
}
