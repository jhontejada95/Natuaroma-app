'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
  await requireAdmin()

  const supabase = createAdminClient()
  await supabase
    .from('orders')
    .update({ order_status: newStatus })
    .eq('id', orderId)
  revalidatePath('/admin/orders')
  revalidatePath('/admin/orders/' + orderId)
}
