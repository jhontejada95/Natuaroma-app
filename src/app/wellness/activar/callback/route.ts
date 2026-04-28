import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const authCode = req.nextUrl.searchParams.get('code')

  const supabase = await createClient()
  const db = supabase as any

  // Intercambiar token de auth
  const tokenCode = req.nextUrl.searchParams.get('code')
  if (tokenCode) {
    await supabase.auth.exchangeCodeForSession(tokenCode)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user && code) {
    // Activar el wellness_access para este usuario
    const { data: access } = await db
      .from('wellness_access')
      .select('id')
      .eq('code', code)
      .is('activated_at', null)
      .maybeSingle()

    if (access) {
      await db
        .from('wellness_access')
        .update({
          user_id: user.id,
          activated_at: new Date().toISOString(),
        })
        .eq('id', access.id)

      // Actualizar perfil
      await supabase
        .from('profiles')
        .update({ wellness_active: true, wellness_code: code } as any)
        .eq('id', user.id)
    }
  }

  return NextResponse.redirect(new URL('/wellness', req.url))
}
