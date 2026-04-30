import { NextRequest, NextResponse } from 'next/server'

// Antiguo callback OAuth/magic-link — flujo eliminado.
// Redirige al activador para que el usuario use el nuevo flujo.
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/wellness/activar', req.url))
}
