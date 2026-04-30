import { NextResponse } from 'next/server'

// Flujo antiguo de magic links eliminado — ahora se usa código de acceso + contraseña.
// Retorna 410 Gone para no romper posibles requests en vuelo.
export async function POST() {
  return NextResponse.json(
    { error: 'Este flujo ya no está disponible. Usa /wellness/activar para activar tu acceso.' },
    { status: 410 }
  )
}
