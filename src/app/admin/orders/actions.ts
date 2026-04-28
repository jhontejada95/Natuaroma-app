'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createClient()
  await supabase
    .from('orders')
    .update({ order_status: newStatus })
    .eq('id', orderId)
  revalidatePath('/admin/orders')
  revalidatePath('/admin/orders/' + orderId)
}
