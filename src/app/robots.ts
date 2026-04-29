import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://natuaroma-app.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin/login', '/api/', '/auth/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
