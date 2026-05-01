/**
 * Logger que en producción omite datos sensibles (PII) de los logs de Vercel.
 * En desarrollo muestra todo para facilitar el debugging.
 *
 * B-04: Evita que emails, nombres y números de orden queden expuestos
 * en los logs de Vercel cuando alguien con acceso los consulta.
 */

const isDev = process.env.NODE_ENV === 'development'

export function log(msg: string, ...args: unknown[]) {
  if (isDev) console.log(`[INFO] ${msg}`, ...args)
}

export function logError(context: string, err?: unknown) {
  if (isDev) {
    console.error(`[ERROR] ${context}`, err)
  } else {
    // En producción: loggeamos el contexto pero no el detalle (que puede tener PII)
    console.error(`[ERROR] ${context}`)
  }
}

export function logWarn(msg: string) {
  console.warn(`[WARN] ${msg}`)
}
