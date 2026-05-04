import { Leaf } from 'lucide-react'

export const metadata = {
  title: 'Política de Tratamiento de Datos Personales — Natuaroma',
  description: 'Política de tratamiento de datos personales de Natuaroma conforme a la Ley 1581 de 2012.',
}

export default function PoliticaDatosPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="flex items-center gap-2 mb-10">
          <a href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Leaf size={18} className="text-primary" />
            <span className="font-display font-bold italic text-primary">Natuaroma</span>
          </a>
        </div>

        <h1 className="font-display text-3xl font-bold text-primary mb-2">
          Política de Tratamiento de Datos Personales
        </h1>
        <p className="text-on-surface-variant text-sm mb-10">
          Última actualización: mayo de 2026
        </p>

        <div className="space-y-8 text-on-surface leading-relaxed">

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">1. Responsable del tratamiento</h2>
            <p className="text-sm text-on-surface-variant">
              El responsable del tratamiento de los datos personales recolectados a través de la plataforma
              <strong className="text-on-surface"> natuaroma.shop</strong> y el portal Natuaroma Wellness es el
              equipo operador de la plataforma, con correo de contacto:{' '}
              <a href="mailto:Natuaroma-wellness@proton.me" className="text-primary underline underline-offset-2">
                Natuaroma-wellness@proton.me
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">2. Datos que recolectamos</h2>
            <p className="text-sm text-on-surface-variant mb-3">
              Recolectamos únicamente los datos necesarios para prestar el servicio:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant pl-2">
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Historial de productos adquiridos</li>
              <li>Información de hábitos de bienestar registrados voluntariamente en la app</li>
              <li>Datos de envío (dirección, ciudad, departamento) para compras en la tienda</li>
              <li>Punto de origen del registro (tienda física o QR)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">3. Finalidad del tratamiento</h2>
            <p className="text-sm text-on-surface-variant mb-3">
              Los datos recolectados se usan exclusivamente para:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant pl-2">
              <li>Gestionar el acceso al portal Natuaroma Wellness</li>
              <li>Procesar y enviar pedidos realizados en la tienda online</li>
              <li>Enviar comunicaciones transaccionales (confirmación de compra, código de acceso Wellness)</li>
              <li>Personalizar el contenido de bienestar según los productos adquiridos</li>
              <li>Mejorar la experiencia de uso de la plataforma</li>
            </ul>
            <p className="text-sm text-on-surface-variant mt-3">
              <strong>No vendemos ni compartimos sus datos con terceros</strong> con fines comerciales o publicitarios.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">4. Base legal</h2>
            <p className="text-sm text-on-surface-variant">
              El tratamiento de datos se realiza con base en el consentimiento expreso del titular,
              otorgado al momento del registro, conforme a la{' '}
              <strong className="text-on-surface">Ley Estatutaria 1581 de 2012</strong> y el
              Decreto Reglamentario 1377 de 2013 de la República de Colombia.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">5. Derechos del titular</h2>
            <p className="text-sm text-on-surface-variant mb-3">
              Como titular de sus datos personales, usted tiene derecho a:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant pl-2">
              <li><strong>Conocer</strong> los datos personales que tenemos sobre usted</li>
              <li><strong>Actualizar o corregir</strong> datos inexactos o incompletos</li>
              <li><strong>Solicitar la supresión</strong> de sus datos cuando no sean necesarios para la finalidad</li>
              <li><strong>Revocar el consentimiento</strong> otorgado para el tratamiento</li>
              <li><strong>Presentar quejas</strong> ante la Superintendencia de Industria y Comercio (SIC)</li>
            </ul>
            <p className="text-sm text-on-surface-variant mt-3">
              Para ejercer cualquiera de estos derechos, escríbanos a:{' '}
              <a href="mailto:Natuaroma-wellness@proton.me" className="text-primary underline underline-offset-2">
                Natuaroma-wellness@proton.me
              </a>
              . Atenderemos su solicitud en un plazo máximo de 15 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">6. Seguridad de los datos</h2>
            <p className="text-sm text-on-surface-variant">
              Implementamos medidas técnicas y organizativas para proteger sus datos contra acceso no autorizado,
              pérdida o alteración. Los datos se almacenan en servidores seguros con cifrado en tránsito y en reposo.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">7. Cookies</h2>
            <p className="text-sm text-on-surface-variant">
              Esta plataforma utiliza cookies de sesión estrictamente necesarias para el funcionamiento del
              portal Wellness y la tienda. No utilizamos cookies de seguimiento ni publicidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-primary mb-3">8. Cambios a esta política</h2>
            <p className="text-sm text-on-surface-variant">
              Podemos actualizar esta política en cualquier momento. Notificaremos los cambios relevantes
              por correo electrónico a los usuarios registrados.
            </p>
          </section>

          <div className="border-t border-outline-variant pt-6">
            <p className="text-xs text-outline text-center">
              Natuaroma · natuaroma.shop · Natuaroma-wellness@proton.me
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
