'use client'

import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/app/admin/products/actions'

type Props = {
  productId: string
  productName: string
}

export function DeleteProductButton({ productId, productName }: Props) {
  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Eliminar "${productName}"?\n\nEsta acción no se puede deshacer.`
    )
    if (!confirmed) return
    await deleteProduct(productId)
  }

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-error px-3 py-1.5 rounded-lg hover:bg-error-container transition-colors"
      title="Eliminar producto"
    >
      <Trash2 size={14} />
      Eliminar
    </button>
  )
}
