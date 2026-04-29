'use client'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '573001234567'
const MESSAGE = encodeURIComponent('Hola Natuaroma 🌿 Tengo una consulta sobre sus productos')

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      style={{ background: '#25D366' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="white"
      >
        <path d="M16.003 0C7.165 0 .003 7.163.003 16c0 2.822.737 5.476 2.027 7.782L.003 32l8.437-2.003A15.94 15.94 0 0 0 16.003 32C24.84 32 32 24.837 32 16S24.84 0 16.003 0Zm0 29.292a13.25 13.25 0 0 1-6.74-1.84l-.484-.287-5.008 1.189 1.215-4.874-.316-.5A13.218 13.218 0 0 1 2.71 16c0-7.33 5.963-13.292 13.293-13.292 7.33 0 13.29 5.962 13.29 13.292 0 7.332-5.96 13.292-13.29 13.292Zm7.29-9.963c-.4-.2-2.366-1.168-2.732-1.3-.366-.133-.632-.2-.9.2-.265.4-1.03 1.3-1.264 1.566-.233.267-.465.3-.865.1-.4-.2-1.688-.623-3.216-1.983-1.188-1.06-1.99-2.37-2.222-2.77-.233-.4-.025-.616.175-.815.18-.18.4-.466.6-.7.2-.233.266-.4.4-.666.133-.267.066-.5-.033-.7-.1-.2-.9-2.166-1.232-2.966-.325-.78-.655-.674-.9-.686l-.766-.013c-.267 0-.7.1-1.066.5s-1.4 1.368-1.4 3.335c0 1.967 1.432 3.868 1.632 4.135.2.267 2.82 4.3 6.832 6.032.956.413 1.702.66 2.284.845.96.305 1.834.262 2.524.16.77-.116 2.366-.968 2.7-1.902.332-.933.332-1.733.232-1.9-.1-.167-.365-.267-.765-.467Z"/>
      </svg>
    </a>
  )
}
