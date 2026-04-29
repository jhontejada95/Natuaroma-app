import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Natuaroma Wellness',
    short_name: 'Natuaroma',
    description: 'Tu portal de bienestar natural. Meditaciones, habitos y rituales artesanales.',
    start_url: '/wellness',
    scope: '/',
    display: 'standalone',
    background_color: '#223426',
    theme_color: '#223426',
    orientation: 'portrait',
    categories: ['health', 'lifestyle', 'wellness'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=390&q=80',
        sizes: '390x844',
        type: 'image/jpeg',
        // @ts-ignore — form_factor is valid in modern browsers
        form_factor: 'narrow',
        label: 'Natuaroma Wellness Dashboard',
      },
    ],
  }
}
