import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  // ── A-03: Headers de seguridad HTTP ──────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Evita clickjacking — la página no puede embeberse en un iframe
          { key: "X-Frame-Options", value: "DENY" },
          // Evita MIME sniffing — el navegador respeta el Content-Type declarado
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Controla qué información de referrer se envía en navegación
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Restringe acceso a hardware del dispositivo
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Fuerza HTTPS por 2 años (HSTS)
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Content Security Policy: restringe origenes de scripts, estilos e imágenes
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Imágenes: Cloudinary, Unsplash, Supabase storage
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co https://*.supabase.in",
              // Scripts: propio + MercadoPago SDK + inline necesario para Next.js
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com",
              // Estilos: propios + inline (Next.js los requiere)
              "style-src 'self' 'unsafe-inline'",
              // Fuentes
              "font-src 'self' data:",
              // Conexiones: Supabase, Resend, MercadoPago, Telegram, Cloudinary
              "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co https://api.resend.com https://api.mercadopago.com https://api.cloudinary.com https://res.cloudinary.com https://api.telegram.org",
              // Frames: solo MercadoPago checkout
              "frame-src https://www.mercadopago.com https://www.mercadopago.com.co",
              // Media: propio y Cloudinary
              "media-src 'self' https://res.cloudinary.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    deviceSizes: [390, 640, 750, 1080, 1200, 1920],
    imageSizes: [32, 64, 128, 256, 512],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
