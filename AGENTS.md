<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Natuaroma — Documento pilar del proyecto

> Archivo privado. No sube al repositorio (.gitignore). Léelo completo antes de tocar cualquier archivo.
> **Última actualización:** 2026-05-02

---

## 1. Contexto de negocio

### Personas
- **Jhon** — desarrollador, dueño del proyecto de la app y la tienda online
- **Luis** — socio y compañero de Jhon en el proyecto
- **Álvaro Cerna** — papá de Jhon, dueño legal de la marca Natuaroma registrada. Opera de forma independiente y desorganizada. La estrategia es crecer sin depender de él.

### Modelo de negocio actual
- Los productos que se venden en la tienda son **en consignación** — lotes que Álvaro le entrega a Jhon. No hay inventario propio todavía.
- La app Wellness es el diferencial: comprar un producto da acceso a la plataforma.
- Los puntos de venta físicos de Natuaroma tienen QR para registro (acceso Wellness más limitado, progresivo).

### Canales de marketing
- Jhon **no controla** las redes sociales de Natuaroma ni su WhatsApp — los maneja otra persona.
- Canales propios disponibles: **TikTok** (Natuaroma no tiene — Jhon puede tomarlo), **Google Ads**, **TikTok Ads**.
- Pendiente definir si se mezclan con los canales de Natuaroma o se operan completamente por separado.

### Estrategia por fases

**Corto plazo — ahora**
- Dejar la app funcional y operativa para pruebas en campo
- Generar volumen de usuarios: compras online + QR en puntos físicos

**Mediano plazo**
- Contenido personalizado según productos comprados (recetas, rituales, guías)
- Incentivos de compra desde la app (ej. 5% descuento si compran a través de la app)
- El contenido actúa como enganche para más ventas de productos en consignación

**Largo plazo**
- App autosustentable con base de usuarios suficiente para monetizar
- Buscar convocatorias de innovación / inyección de capital
- Escalar infraestructura (actualmente todo en tier gratuito)

---

## 2. Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.4 — App Router, Server Actions, Turbopack |
| Base de datos / Auth | Supabase (PostgreSQL + Auth) |
| Estilos | Tailwind CSS con design tokens custom |
| Emails | Resend (inicialización lazy — no falla sin API key local) |
| Pagos | MercadoPago |
| Imágenes | Cloudinary |
| Deploy | Vercel — https://www.natuaroma.shop |
| Rate limiting | @upstash/ratelimit + @upstash/redis (no-op si no hay env vars) |
| Notificaciones | Telegram bot (opcional, vars no configuradas aún) |

---

## 3. Regla crítica — dos clientes Supabase

**Esta es la regla más importante del proyecto. Nunca romperla.**

```ts
// ✅ CORRECTO
const supabase = await createClient()            // SOLO para auth.getUser() — necesita cookies
const { data: { user } } = await supabase.auth.getUser()
const db = createAdminClient()                   // TODOS los queries de DB — bypasea RLS

// ❌ MAL — createAdminClient no tiene cookies, auth.getUser() devuelve null
const supabase = createAdminClient()
const { data: { user } } = await supabase.auth.getUser()  // → user = null → crash
```

- `createClient()` → `src/lib/supabase/server.ts` — lee cookies de sesión SSR
- `createAdminClient()` → `src/lib/supabase/admin.ts` — usa `SUPABASE_SERVICE_ROLE_KEY`, bypasea RLS

---

## 4. Arquitectura de rutas y protección

### Proxy (antes middleware)
- Next.js 16 usa `src/proxy.ts` en lugar de `src/middleware.ts`
- `proxy()` llama a `updateSession()` para proteger `/admin` y `/wellness`

### Rutas públicas (no requieren sesión)
```
/wellness/login
/wellness/activar
/wellness/forgot-password
/wellness/reset-password
/admin/login
/admin/forgot-password
/admin/reset-password
/auth/confirm
```

### Protección de Server Actions
- Todos los admin actions llaman `await requireAdmin()` al inicio
- `src/lib/auth/requireAdmin.ts` — verifica auth + rol admin

---

## 5. Flujo Wellness

### Fuentes de acceso — tabla `wellness_access`

| Fuente | `source` | Flujo |
|--------|----------|-------|
| Compra online | `purchase` | Webhook MP → crea registro → envía código |
| Tienda física QR | `physical` | `/registro` → admin aprueba → envía código |
| Invitación manual | `invitation` | Admin panel crea directamente |

### Activación (magic links eliminados)
```
/wellness/activar → código NAT-XXXXXX + email
  ↓
/wellness/activar/setup → crear contraseña
  setupWellnessAccount():
    - revalida que código pertenece al email
    - valida expiración
    - crea user en Supabase Auth
    - marca activated_at
  ↓
/wellness/login?welcome=1 → signInWithPassword → window.location.href='/wellness'
  ↓
/wellness (dashboard)
```

### Reset de contraseña Wellness
```
/wellness/forgot-password → verifica activated_at IS NOT NULL → resetPasswordForEmail()
  ↓ email con link
/auth/confirm → intercambia token → redirige a /wellness/reset-password
  ↓
/wellness/reset-password → updateUser({ password }) → signOut → /wellness/login
```

### Reset de contraseña Admin
```
/admin/forgot-password → verifica email en ADMIN_EMAILS → resetPasswordForEmail()
  ↓ email con link
/auth/confirm → intercambia token → redirige a /admin/reset-password
  ↓
/admin/reset-password → updateUser({ password }) → signOut → /admin/login
```

---

## 6. Checkout y pagos

- El costo de envío se calcula **en servidor** con `getShippingCost(departamento)` — no se acepta del cliente
- Validaciones server-side: productos, precio, stock, cantidades (`parseInt`, 1–99), total > 0
- Webhook MercadoPago: HMAC con `timingSafeEqual` + idempotencia + descuenta stock antes de marcar paid
- Si falla stock: orden queda `paid/cancelled` con nota `STOCK_ERROR`

---

## 7. Seguridad implementada

| ID | Descripción | Estado |
|----|-------------|--------|
| C-01 | Broken Access Control — `requireAdmin()` en todos los admin actions | ✅ |
| C-02 | Overselling — `decrement_order_stock()` transaccional en webhook | ✅ |
| C-03 | Price manipulation — validación server-side de cantidades y total | ✅ |
| A-01 | Rate limiting — Upstash, no-op si no hay env vars | ✅ (falta: forgot/reset-password) |
| A-02 | Códigos criptográficos — `crypto.randomBytes()` en `generateCode()` | ✅ |
| A-03 | Security headers — CSP, HSTS, X-Frame-Options, etc. en `next.config.ts` | ✅ |
| A-05 | HMAC webhook — `timingSafeEqual`, retorna `false` si no hay secret | ✅ |
| B-01 | Admin emails — desde `ADMIN_EMAILS` env var | ✅ |
| B-04 | PII en logs — `logger.ts` oculta detalles en producción | ✅ |

---

## 8. Base de datos

### RLS activo en Supabase
```
profiles     → SELECT/UPDATE solo propio
categories   → SELECT público
products     → SELECT solo activos
orders       → SELECT solo propio (customer_email = auth.email())
order_items  → SELECT items de órdenes propias
```
Las tablas `wellness_access`, `wellness_content`, `user_habits` **no tienen RLS** — solo se acceden via `createAdminClient()`.

### Funciones SQL ejecutadas
- `decrement_stock(p_product_id, p_qty)` — descuento atómico individual
- `decrement_order_stock(p_order_id)` — descuento transaccional de toda una orden
- Índices: `idx_wellness_access_email`, `idx_user_habits_user`, `idx_orders_customer_email`

---

## 9. Variables de entorno

### Configuradas en Vercel ✅
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_SITE_URL
MERCADO_PAGO_ACCESS_TOKEN
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
ADMIN_EMAILS                         ← emails separados por coma
```

### Pendientes ⚠️
```
MERCADOPAGO_WEBHOOK_SECRET    → panel MP → Webhooks → campo Secret
UPSTASH_REDIS_REST_URL        → upstash.com → DB Redis → REST API
UPSTASH_REDIS_REST_TOKEN      → mismo lugar
```

### Opcionales
```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

---

## 10. Archivos clave

```
src/
├── proxy.ts                              ← protección de rutas (Next.js 16)
├── lib/
│   ├── supabase/
│   │   ├── admin.ts                      ← createAdminClient()
│   │   ├── server.ts                     ← createClient()
│   │   └── middleware.ts                 ← updateSession() llamado desde proxy.ts
│   ├── auth/requireAdmin.ts              ← verifica auth + rol en server actions
│   ├── utils/generateCode.ts             ← crypto.randomBytes → NAT-XXXXXXXX
│   ├── ratelimit.ts                      ← Upstash, graceful no-op
│   ├── logger.ts                         ← log() dev only, logError() oculta en prod
│   └── email.ts                          ← Resend lazy init
├── app/
│   ├── auth/confirm/route.ts             ← token PKCE → redirige a next= correcto
│   ├── wellness/
│   │   ├── activar/                      ← validar código + crear contraseña
│   │   ├── forgot-password/              ← recuperar contraseña
│   │   ├── reset-password/               ← nueva contraseña ('use client')
│   │   ├── login/page.tsx
│   │   └── layout.tsx                    ← PUBLIC_WELLNESS excluye forgot/reset
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── orders/actions.ts             ← requireAdmin()
│   │   ├── products/actions.ts           ← requireAdmin()
│   │   ├── products/new/actions.ts       ← requireAdmin()
│   │   ├── wellness/actions.ts           ← requireAdmin() + generateCode()
│   │   └── wellness/contenido/actions.ts ← requireAdmin(), content_body + media_url
│   ├── registro/actions.ts               ← rate limiting + generateCode() + Telegram
│   ├── checkout/actions.ts               ← getShippingCost() server-side + validaciones
│   └── api/webhooks/mercadopago/route.ts ← HMAC + idempotencia + decrement_order_stock
└── supabase/
    ├── migrations/decrement_stock.sql
    └── rls_policies.sql
```

---

## 11. Convenciones y gotchas

- **SQL en el chat** — cualquier SQL que el usuario deba ejecutar se pone como bloque de código en el mensaje, no solo en archivos
- **`&&` no funciona en PowerShell** — dar comandos separados
- **Git index.lock** — si queda lock file: `Remove-Item .git\index.lock -Force`
- **Resend** — inicialización lazy, no falla si no hay `RESEND_API_KEY` en local
- **Nunca** usar `Math.random()` para códigos — siempre `generateCode()` de `src/lib/utils/generateCode.ts`
- **Nunca** hacer queries de DB con `createClient()` — solo con `createAdminClient()`

---

## 12. Pendientes técnicos

- Activar Upstash (pendiente recuperar acceso al correo)
- Extender rate limiting a `forgot-password` y `reset-password`
- Probar compra MercadoPago real/sandbox end-to-end
- Probar activación Wellness con casos borde (email incorrecto, código expirado)
- Considerar Sentry para observabilidad en producción
- Limpiar deuda de lint
