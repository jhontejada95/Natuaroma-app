import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { CartButton } from "@/components/CartButton";
import { CartDrawer } from "@/components/CartDrawer";
import { Leaf } from "lucide-react";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Natuaroma | Tu Ritual de Bienestar",
  description: "Tienda premium de bienestar, aromaterapia y autocuidado consciente.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        {/* Barra superior */}
        <div className="bg-primary text-surface text-xs text-center py-2 px-4 tracking-wide font-medium">
          Envios a todo Colombia &middot; Ingredientes 100% naturales &middot; Compra segura
        </div>

        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-outline-variant">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center group-hover:bg-primary-container transition-colors">
                <Leaf size={16} className="text-surface" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-primary">Natuaroma</span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              <a href="/tienda" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Tienda</a>
              <a href="#bienestar" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Wellness App</a>
              <a href="#nosotros" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">Nosotros</a>
            </nav>

            <div className="flex items-center gap-4">
              <CartButton />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-primary text-surface/80 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-surface/20 rounded-full flex items-center justify-center">
                  <Leaf size={14} className="text-surface" />
                </div>
                <span className="font-display font-bold text-xl text-surface">Natuaroma</span>
              </div>
              <p className="text-sm leading-relaxed text-surface/70">
                Esencias, aromas y productos naturales para acompanar tu cuerpo, tu hogar y tus sentidos.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-surface text-sm uppercase tracking-widest">Navegacion</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/tienda" className="hover:text-surface transition-colors">Tienda</a></li>
                <li><a href="#bienestar" className="hover:text-surface transition-colors">Wellness App</a></li>
                <li><a href="#nosotros" className="hover:text-surface transition-colors">Nosotros</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-surface text-sm uppercase tracking-widest">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-surface/70">hola@natuaroma.com</li>
                <li className="text-surface/70">Colombia - Envios nacionales</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface/10 py-6 text-center text-xs text-surface/50">
            &copy; {new Date().getFullYear()} Natuaroma. Todos los derechos reservados.
          </div>
        </footer>

        <CartDrawer />
      </body>
    </html>
  );
}
