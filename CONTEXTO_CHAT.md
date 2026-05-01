# Natuaroma — Estado del proyecto para continuar en nuevo chat

> **Fecha:** 2026-04-30 | **Repo local:** `C:\Users\HP\Desktop\Natuaroma\natuaroma-app`
> El usuario también compartirá la carpeta del proyecto como contexto.

---

## Stack técnico

- **Next.js 14** — App Router, server actions, server components
- **Supabase** — Auth + PostgreSQL
- **Tailwind CSS** con design tokens custom (variables en `tailwind.config`)
- **Resend** — emails transaccionales
- **MercadoPago** — pagos online
- **Cloudinary** — imágenes de productos
- **Vercel** — deploy en `https://www.natuaroma.shop`
- **Telegram bot** — notificaciones de registro QR (vars opcionales, no configuradas aún)

---

## Regla crítica — dos clientes Supabase

Esta es la regla más importante del proyecto:

```ts
// CORRECTO — siempre así en server components/actions:
const supabase = await createClient()           // SOLO para auth.getUser() — necesita cookies
const { data: { user } } = await supabase.auth.getUser()
const db = createAdminClient()                  // TODOS los queries de DB — bypasea RLS

// MAL — createAdminClient no tiene cookies, auth.getUser() devuelve null
const supabase = createAdminClient()
const { data: { user } } = await supabase.auth.getUser()  // user = null -> crash
```

- `createClient()` → `src/lib/supabase/server.ts` — lee cookies de sesión SSR
- `createAdminClient()` → `src/lib/supabase/admin.ts` — usa `SUPABASE_SERVICE_ROLE_KEY`, bypasea RLS

---

## Flujo Wellness (el más complejo)

### Fuentes de acceso — tabla `wellness_access`

| Fuente            | `source`     | `status` inicial | Flujo                                      |
| ----------------- | ------------ | ---------------- | ------------------------------------------ |
| Compra online     | `purchase`   | `active`         | Webhook MP crea registro + envía código    |
| Tienda física QR  | `physical`   | `pending`        | `/registro` → admin aprueba → envía código |
| Invitación manual | `invitation` | `active`         | Admin panel crea directamente              |

### Flujo de activación completo (magic links eliminados)

```
/wellness/activar
  → usuario ingresa código NAT-XXXXXX + email
  → actions.ts valida código en DB via adminClient
  ↓
/wellness/activar/setup?code=...&email=...
  → PasswordSetupForm.tsx — crea contraseña (con ojo toggle)
  → setupWellnessAccount(): crea user en Supabase Auth via admin API
  → marca wellness_access.activated_at
  ↓
/wellness/login?email=...&welcome=1
  → WellnessPasswordLogin.tsx — client-side signInWithPassword
  → window.location.href = '/wellness' (hard navigation, evita race conditions)
  ↓
/wellness — dashboard + WellnessPWABanner (detecta iOS/Android)
```

### Validación de unicidad de email

Implementada en los 3 puntos de entrada para evitar duplicados:

- `registro/actions.ts` — verifica antes de insertar registro físico
- `admin/wellness/actions.ts` → `createInvitation` — redirige con error si ya existe
- `api/webhooks/mercadopago/route.ts` — si ya tiene acceso, solo envía confirmación de compra

---

## RLS — ejecutado y activo en Supabase

```sql
-- Habilitado con políticas en 5 tablas:
-- profiles    → SELECT/UPDATE solo propio (auth.uid() = id)
-- categories  → SELECT público (true)
-- products    → SELECT solo activos (status = 'active')
-- orders      → SELECT solo propio (customer_email = auth.email())
-- order_items → SELECT items de órdenes propias
```

Las tablas `wellness_access`, `wellness_content`, `user_habits` **no tienen RLS** — todas sus operaciones van por `createAdminClient()`.

---

## Variables de entorno en Vercel — todas configuradas

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
```

**Pendiente agregar cuando se configure en panel de MP:**

- `MERCADOPAGO_WEBHOOK_SECRET` → activa verificación HMAC en el webhook (ya implementada en código)

**Opcionales para notificaciones Telegram:**

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

**Supabase Dashboard — activar manualmente:**

- Authentication → Settings → "Enable leaked password protection" (toggle)

---

## Seguridad implementada

- **Open redirect** sanitizado en `WellnessPasswordLogin.tsx` — `next` solo acepta rutas internas
- **Webhook HMAC** en `api/webhooks/mercadopago/route.ts` — verifica `x-signature` si `MERCADOPAGO_WEBHOOK_SECRET` está configurado
- **`order_items` error handling** — si falla el insert, la orden se marca `ERROR:order_items_failed`
- **Rutas muertas desactivadas** (devuelven 410):
  - `auth/wellness-magic-link/route.ts`
  - `auth/wellness-password-login/route.ts`
  - `wellness/activar/callback/route.ts`
- **Double submit guard** en login y setup contraseña
- **Idempotencia** en activación — `.is('activated_at', null)` evita doble activación
- **`findUserByEmail()`** via REST API en `setup/actions.ts` — evita timeout de `listUsers()` en Vercel

---

## Archivos clave

```
src/
├── lib/supabase/
│   ├── admin.ts                     ← createAdminClient() con service role
│   └── server.ts                    ← createClient() con cookies SSR
├── app/
│   ├── wellness/
│   │   ├── activar/
│   │   │   ├── page.tsx             ← Paso 1: validar código + email
│   │   │   ├── actions.ts           ← valida código, redirige a setup
│   │   │   └── setup/
│   │   │       ├── page.tsx         ← Paso 2: crear contraseña
│   │   │       └── actions.ts       ← crea user en Auth, activa código
│   │   ├── login/page.tsx           ← solo email+password (sin magic links)
│   │   ├── layout.tsx               ← protege rutas wellness, verifica acceso
│   │   ├── page.tsx                 ← dashboard (createClient para user + adminClient para DB)
│   │   ├── habitos/
│   │   │   ├── page.tsx             ← (createClient para user + adminClient para DB)
│   │   │   └── actions.ts           ← (createClient para user + adminClient para DB)
│   │   └── biblioteca/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── admin/wellness/
│   │   ├── page.tsx                 ← panel: aprobación física + invitaciones + tabla
│   │   └── actions.ts               ← approvePhysicalRequest, createInvitation
│   ├── registro/
│   │   ├── page.tsx                 ← formulario QR tienda física
│   │   └── actions.ts               ← submitPhysicalRegistration + Telegram notif
│   ├── api/webhooks/mercadopago/
│   │   └── route.ts                 ← webhook con HMAC opcional
│   └── checkout/
│       ├── actions.ts               ← createOrder (adminClient completo)
│       └── success/page.tsx         ← muestra código wellness si primera compra
├── components/wellness/
│   ├── WellnessPasswordLogin.tsx    ← client-side login, window.location.href
│   ├── PasswordSetupForm.tsx        ← setup contraseña con ojo toggle
│   ├── WellnessPWABanner.tsx        ← detecta iOS/Android, instrucciones PWA
│   └── PWAInstallGuide.tsx
└── lib/email.ts                     ← sendOrderConfirmation, sendWellnessCode (Resend)
```

---

## Gotchas conocidos del entorno de desarrollo

- **El Write tool del sandbox genera null bytes** en archivos grandes — siempre usar Python para escribir archivos largos:
  
  ```python
  with open(path, 'w', encoding='utf-8') as f:
      f.write(content)
  ```
- **El Edit tool puede truncar archivos** si el reemplazo es largo — si pasa, reescribir el archivo completo con Python
- **Git index.lock** — el sandbox a veces deja lock files. El usuario debe correr en PowerShell:
  
  ```powershell
  Remove-Item .git\index.lock -Force
  # Si el index se corrompe:
  Remove-Item .git\index -Force
  git reset
  ```
- **`&&` no funciona en PowerShell** — dar comandos separados al usuario

---

## Pendiente de probar

1. **Flujo completo end-to-end**: registro QR → aprobar en admin → activar código → crear contraseña → login → popup PWA
2. **Compra con MercadoPago**: pago real → webhook → email con código wellness
3. **Compra repetida**: segundo pedido del mismo email → solo recibe confirmación de compra, sin código wellness extra
4. **PWA install**: popup en iOS (Safari) y Android (Chrome)
5. **Hábitos**: marcar/desmarcar, racha, calendario semanal

---

## Último estado en producción

Dos commits recientes en Vercel (ambos exitosos, TypeScript limpio):

1. `security: RLS + adminClient checkout/admin + webhook HMAC + dead routes cleanup`
2. `fix: separar auth.getUser (createClient) de DB queries (createAdminClient) en wellness pages`
