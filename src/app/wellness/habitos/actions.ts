'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function toggleHabit(habitName: string, markDone: boolean) {
  const supabase = createAdminClient()
  const db = supabase

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (markDone) {
    // Calcular racha actual
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const yesterdayEnd = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)

    const { data: yestHabit } = await db
      .from('user_habits')
      .select('streak_count')
      .eq('user_id', user.id)
      .eq('habit_name', habitName)
      .gte('completed_at', yesterday.toISOString())
      .lte('completed_at', yesterdayEnd.toISOString())
      .maybeSingle()

    const streak = yestHabit ? (yestHabit.streak_count ?? 1) + 1 : 1

    await db.from('user_habits').insert({
      user_id: user.id,
      habit_name: habitName,
      streak_count: streak,
    })
  } else {
    // Desmarcar (eliminar el de hoy)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    await db
      .from('user_habits')
      .delete()
      .eq('user_id', user.id)
      .eq('habit_name', habitName)
      .gte('completed_at', today.toISOString())
  }

  revalidatePath('/wellness/habitos')
  revalidatePath('/wellness')
}
