/**
 * Rate limiting con Upstash Redis.
 *
 * SETUP (una sola vez):
 *   1. Crear cuenta gratis en https://upstash.com
 *   2. Crear una base de datos Redis
 *   3. Copiar las credenciales y agregarlas en Vercel:
 *      UPSTASH_REDIS_REST_URL=https://...upstash.io
 *      UPSTASH_REDIS_REST_TOKEN=...
 *   4. npm install @upstash/ratelimit @upstash/redis
 *
 * Si las env vars no están configuradas, el rate limiter es un no-op
 * (deja pasar todas las peticiones) para no romper el flujo en desarrollo.
 */

type RateLimitResult = { success: boolean; limit: number; remaining: number }

// Límites por ruta (requests / ventana de tiempo)
export const LIMITS = {
  checkout:  { requests: 5,  window: '1 m'  }, // 5 intentos por minuto
  login:     { requests: 10, window: '1 m'  }, // 10 intentos por minuto
  registro:  { requests: 3,  window: '5 m'  }, // 3 intentos cada 5 minutos
  activar:   { requests: 10, window: '1 m'  }, // 10 intentos por minuto
  webhook:   { requests: 60, window: '1 m'  }, // 60 peticiones por minuto
} as const

type LimitKey = keyof typeof LIMITS

// Lazy-loaded para no crashear si las env vars no están
let _ratelimiters: Map<LimitKey, { limit: (id: string) => Promise<RateLimitResult> }> | null = null

async function getRatelimiters() {
  if (_ratelimiters) return _ratelimiters

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  try {
    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')

    const redis = new Redis({ url, token })
    _ratelimiters = new Map()

    for (const [key, cfg] of Object.entries(LIMITS) as [LimitKey, typeof LIMITS[LimitKey]][]) {
      _ratelimiters.set(key, new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(cfg.requests, cfg.window as `${number} ${'s'|'m'|'h'|'d'}`),
        prefix: `natuaroma:${key}`,
      }))
    }

    return _ratelimiters
  } catch {
    return null
  }
}

/**
 * Verifica si el IP ha superado el límite para una ruta dada.
 * Retorna true si la petición DEBE SER BLOQUEADA.
 *
 * @example
 * const blocked = await isRateLimited('checkout', ip)
 * if (blocked) redirect('/checkout?error=Demasiados intentos. Espera un momento.')
 */
export async function isRateLimited(route: LimitKey, identifier: string): Promise<boolean> {
  const limiters = await getRatelimiters()
  if (!limiters) return false // no-op si Upstash no está configurado

  const limiter = limiters.get(route)
  if (!limiter) return false

  const { success } = await limiter.limit(identifier)
  return !success
}
