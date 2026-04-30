'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function toggleContentPublished(contentId: string, newValue: boolean) {
  const supabase = createAdminClient()
  const db = supabase
  await db.from('wellness_content').update({ is_published: newValue }).eq('id', contentId)
  revalidatePath('/admin/wellness/contenido')
  revalidatePath('/wellness/biblioteca')
}

export async function createWellnessContent(formData: FormData) {
  const supabase = createAdminClient()
  const db = supabase

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string || null
  const body = formData.get('body') as string || null
  const youtube_url = formData.get('youtube_url') as string || null
  const audio_url = formData.get('audio_url') as string || null
  const category = formData.get('category') as string || null
  const duration_minutes = formData.get('duration_minutes') ? Number(formData.get('duration_minutes')) : null
  const sort_order = formData.get('sort_order') ? Number(formData.get('sort_order')) : 99
  const is_published = formData.get('is_published') === 'true'

  await db.from('wellness_content').insert({
    title,
    slug,
    type,
    description,
    body,
    youtube_url,
    audio_url,
    category,
    duration_minutes,
    sort_order,
    is_published,
  })

  revalidatePath('/admin/wellness/contenido')
  revalidatePath('/wellness/biblioteca')
}
