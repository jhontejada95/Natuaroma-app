import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { CartButton } from "@/components/CartButton";
import { CartDrawer } from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Natuaroma | Tu Ritual de Bienestar",
  description: "Tienda premium de bienestar, aromaterapia y autocuidado consciente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-dim">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="font-display font-bold text-2xl tracking-tight text-primary">Natuaroma</div>
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-sm font-medium hover:text-primary transition-colors border-b-2 border-primary pb-1">Tienda</a>
              <a href="#" className="text-sm font-medium text-foreground/60 hover:text-primary transition-colors">Wellness App</a>
            </nav>
            <div className="flex items-center gap-4">
              <CartButton />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-surface-dim py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} Natuaroma. Todos los derechos reservados.
          </div>
        </footer>
        <CartDrawer />
      </body>
    </html>
  );
}
