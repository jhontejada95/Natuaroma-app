import { randomBytes } from 'crypto'

/**
 * Genera un código de acceso Wellness criptográficamente seguro.
 * Formato: NAT-XXXXXXXX (8 caracteres base32 sin caracteres ambiguos)
 *
 * Espacio de claves: 32^8 = ~1 billón de combinaciones.
 * Usa crypto.randomBytes() en lugar de Math.random() (no criptográfico).
 */
export function generateCode(): string {
  // Alfabeto sin caracteres ambiguos (sin 0/O, 1/I/L)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(8)
  const code = Array.from(bytes)
    .map(b => chars[b % chars.length])
    .join('')
  return 'NAT-' + code
}
