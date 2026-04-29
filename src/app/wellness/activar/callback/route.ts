import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')

  const supabase = await createClient()
  const db = supabase as any

  // Exchange auth code for session
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user && code) {
    // Find the wellness_access with this activation code
    const { data: access } = await db
      .from('wellness_access')
      .select('id, password_set')
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

      // Update profile
      await db
        .from('profiles')
        .update({ wellness_active: true })
        .eq('id', user.id)

      // First activation — send to password setup
      return NextResponse.redirect(new URL('/wellness/activar/setup?code=' + code, req.url))
    }
  }

  return NextResponse.redirect(new URL('/wellness', req.url))
}
