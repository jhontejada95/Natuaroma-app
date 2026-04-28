'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteProduct(productId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', productId)
  if (error) {
    console.error('Error eliminando producto:', error)
    return
  }
  revalidatePath('/admin/products')
  revalidatePath('/tienda')
  revalidatePath('/')
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string, 10)
  const category_id = formData.get('category_id') as string
  const status = formData.get('status') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string

  const { error } = await supabase
    .from('products')
    .update({
      name,
      slug,
      price,
      stock,
      category_id: category_id || null,
      status,
      short_description: description || null,
      images: image_url ? [image_url] : [],
    })
    .eq('id', productId)

  if (error) {
    console.error('Error actualizando producto:', error)
    redirect(`/admin/products/${productId}/edit?error=No se pudo actualizar el producto`)
  }

  revalidatePath('/admin/products')
  revalidatePath('/tienda')
  revalidatePath('/')
  redirect('/admin/products')
}
