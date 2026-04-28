'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = parseFloat(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string, 10)
  const category_id = formData.get('category_id') as string
  const status = formData.get('status') as string

  const { error } = await supabase.from('products').insert({
    name,
    slug,
    price,
    stock,
    category_id: category_id || null,
    status,
  })

  if (error) {
    console.error('Error creating product:', error)
    redirect('/admin/products/new?error=Ocurrio un error al crear el producto')
  }

  // Redirigir de vuelta al catálogo
  redirect('/admin/products')
}
