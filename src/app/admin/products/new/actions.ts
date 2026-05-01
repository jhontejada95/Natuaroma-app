'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const supabase = createAdminClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string, 10)
  const category_id = formData.get('category_id') as string
  const status = formData.get('status') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string

  const { error } = await supabase.from('products').insert({
    name,
    slug,
    price,
    stock,
    category_id: category_id || null,
    status,
    short_description: description || null,
    images: image_url ? [image_url] : [],
  })

  if (error) {
    console.error('Error creating product:', error)
    redirect('/admin/products/new?error=Ocurrio un error al crear el producto')
  }

  revalidatePath('/admin/products')
  revalidatePath('/tienda')
  revalidatePath('/')
  redirect('/admin/products')
}
