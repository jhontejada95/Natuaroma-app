import { Resend } from 'resend'
import { log, logError } from '@/lib/logger'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Natuaroma <hola@natuaroma.shop>'
let resend: Resend | null = null

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  resend ??= new Resend(apiKey)
  return resend
}

/* ──────────────────────────────────────────────────────────
   TEMPLATE: Confirmación de Orden
   ────────────────────────────────────────────────────────── */
function orderConfirmationHtml(params: {
  orderNumber: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  address: string
}) {
  const { orderNumber, customerName, items, total, address } = params
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e5e2dd;font-family:'Georgia',serif;color:#1c1c19;">${i.name}</td>
        <td style="padding:12px 0;border-bottom:1px solid #e5e2dd;text-align:center;color:#434842;font-size:14px;">${i.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #e5e2dd;text-align:right;color:#1c1c19;font-weight:600;">$${(i.price * i.quantity).toLocaleString('es-CO')}</td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Confirmación de Orden</title></head>
<body style="margin:0;padding:0;background:#fcf9f4;font-family:'Be Vietnam Pro',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(56,75,59,0.08);">

    <!-- Header -->
    <div style="background:#223426;padding:48px 40px;text-align:center;">
      <p style="color:#e1c385;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;">Natuaroma</p>
      <h1 style="color:#ffffff;font-family:'Georgia',serif;font-size:32px;font-weight:400;margin:0;font-style:italic;">Gracias por tu compra</h1>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="color:#1c1c19;font-size:16px;line-height:1.6;margin:0 0 8px;">Hola <strong>${customerName}</strong>,</p>
      <p style="color:#434842;font-size:15px;line-height:1.6;margin:0 0 32px;">Tu orden ha sido recibida y está siendo procesada con cuidado. Pronto recibirás una notificación cuando tu pedido esté en camino.</p>

      <!-- Order number -->
      <div style="background:#f0ede9;border-radius:16px;padding:20px;text-align:center;margin-bottom:32px;">
        <p style="color:#434842;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Número de Orden</p>
        <p style="color:#223426;font-family:'Georgia',serif;font-size:28px;font-weight:600;margin:0;letter-spacing:2px;">${orderNumber}</p>
      </div>

      <!-- Products -->
      <h2 style="color:#223426;font-family:'Georgia',serif;font-size:20px;font-weight:400;margin:0 0 16px;border-bottom:2px solid #e5e2dd;padding-bottom:12px;">Tu Ritual</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#737872;padding-bottom:12px;">Producto</th>
            <th style="text-align:center;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#737872;padding-bottom:12px;">Cant.</th>
            <th style="text-align:right;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#737872;padding-bottom:12px;">Precio</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top:16px;font-family:'Georgia',serif;font-size:18px;color:#223426;font-weight:600;">Total</td>
            <td style="padding-top:16px;text-align:right;font-family:'Georgia',serif;font-size:20px;color:#223426;font-weight:700;">$${total.toLocaleString('es-CO')} COP</td>
          </tr>
        </tfoot>
      </table>

      <!-- Address -->
      <div style="margin-top:32px;background:#f6f3ee;border-radius:16px;padding:20px;">
        <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#737872;margin:0 0 8px;">Enviar a</p>
        <p style="color:#1c1c19;font-size:15px;line-height:1.6;margin:0;">${address}</p>
      </div>

      <p style="color:#434842;font-size:14px;line-height:1.6;margin:32px 0 0;">Si tienes alguna pregunta sobre tu pedido, responde a este correo o escríbenos al WhatsApp.</p>
    </div>

    <!-- Footer -->
    <div style="background:#f0ede9;padding:32px 40px;text-align:center;">
      <p style="color:#223426;font-family:'Georgia',serif;font-size:18px;font-style:italic;margin:0 0 8px;">Natuaroma</p>
      <p style="color:#737872;font-size:12px;margin:0;">Bienestar artesanal · Hecho en Colombia con amor 🌿</p>
    </div>
  </div>
</body>
</html>`
}

/* ──────────────────────────────────────────────────────────
   TEMPLATE: Código Early Access Wellness
   ────────────────────────────────────────────────────────── */
function wellnessCodeHtml(params: { customerName: string; code: string; activationUrl: string }) {
  const { customerName, code, activationUrl } = params
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Tu Acceso Wellness</title></head>
<body style="margin:0;padding:0;background:#fcf9f4;font-family:'Be Vietnam Pro',Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#223426;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px rgba(34,52,38,0.25);">

    <!-- Header -->
    <div style="padding:56px 40px 40px;text-align:center;">
      <div style="width:72px;height:72px;background:rgba(225,195,133,0.15);border-radius:50%;margin:0 auto 24px;line-height:72px;font-size:32px;">🌿</div>
      <p style="color:#e1c385;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;">Natuaroma Wellness</p>
      <h1 style="color:#ffffff;font-family:'Georgia',serif;font-size:34px;font-weight:400;margin:0;font-style:italic;line-height:1.2;">Tu Santuario<br>Digital te espera</h1>
    </div>

    <!-- Body -->
    <div style="background:#fcf9f4;margin:0 24px 24px;border-radius:20px;padding:36px;">
      <p style="color:#1c1c19;font-size:16px;line-height:1.6;margin:0 0 16px;">Hola <strong>${customerName}</strong>,</p>
      <p style="color:#434842;font-size:15px;line-height:1.6;margin:0 0 28px;">Como cliente Natuaroma tienes acceso <em>anticipado</em> a nuestra app de bienestar. Meditaciones, tracker de hábitos y contenido exclusivo de aromaterapia te esperan.</p>

      <!-- Code -->
      <div style="background:#223426;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
        <p style="color:#e1c385;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;">Tu Código Early Access</p>
        <p style="color:#ffffff;font-family:'Courier New',monospace;font-size:28px;letter-spacing:4px;font-weight:700;margin:0;word-break:break-all;line-height:1.3;">${code}</p>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${activationUrl}" style="display:inline-block;background:#e1c385;color:#251a00;text-decoration:none;padding:16px 36px;border-radius:9999px;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Activar Acceso Ahora</a>
      </div>

      <div style="background:#f0ede9;border-radius:12px;padding:16px;margin-bottom:0;">
        <p style="color:#434842;font-size:13px;line-height:1.6;margin:0;">
          📌 <strong>Cómo activar:</strong> Haz clic en el botón o ingresa a <a href="${activationUrl}" style="color:#223426;">${activationUrl.split('?')[0]}</a>, ingresa tu código y correo. El acceso dura 1 año.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:24px 40px 36px;text-align:center;">
      <p style="color:#b6ccb7;font-family:'Georgia',serif;font-size:16px;font-style:italic;margin:0 0 6px;">Natuaroma</p>
      <p style="color:#506352;font-size:12px;margin:0;">Bienestar artesanal · Hecho en Colombia 🇨🇴</p>
    </div>
  </div>
</body>
</html>`
}

/* ──────────────────────────────────────────────────────────
   FUNCIONES PÚBLICAS
   ────────────────────────────────────────────────────────── */

export async function sendOrderConfirmation(params: {
  to: string
  orderNumber: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  address: string
}) {
  const resendClient = getResendClient()
  if (!resendClient) {
    log('[email] RESEND_API_KEY no configurado, omitiendo email de confirmación')
    return
  }
  try {
    await resendClient.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `✅ Orden ${params.orderNumber} confirmada — Natuaroma`,
      html: orderConfirmationHtml(params),
    })
    log('[email] Confirmación de orden enviada')
  } catch (err) {
    logError('[email] Error enviando confirmación de orden', err)
  }
}

export async function sendWellnessCode(params: {
  to: string
  customerName: string
  code: string
}) {
  const resendClient = getResendClient()
  if (!resendClient) {
    log('[email] RESEND_API_KEY no configurado, omitiendo email wellness')
    return
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://natuaroma-app.vercel.app'
  const activationUrl = `${baseUrl}/wellness/activar?code=${params.code}`
  try {
    await resendClient.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: `🌿 Tu acceso Wellness Natuaroma está listo — ${params.code}`,
      html: wellnessCodeHtml({ ...params, activationUrl }),
    })
    log('[email] Código wellness enviado')
  } catch (err) {
    logError('[email] Error enviando código wellness', err)
  }
}
