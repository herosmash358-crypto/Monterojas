import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { getCategories } from '@/lib/server/catalog';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Monterojas — Café de Origen y Tostado Artesanal Colombiano',
  description:
    'Café de especialidad 100% colombiano tostado en origen con alma de montaña. Huila, Nariño, Cauca, micro-lotes Geisha, cápsulas compostables y métodos de barista en casa.',
  keywords: [
    'café colombiano',
    'café de especialidad',
    'café en grano',
    'geisha huila',
    'café nariño',
    'v60 barista',
    'café molido colombia',
    'monterojas café',
  ],
  authors: [{ name: 'Monterojas Café' }],
  openGraph: {
    title: 'Monterojas — Café de Origen Colombiano',
    description: 'Tostión artesanal fresca cada semana desde las montañas de Colombia.',
    url: 'https://monterojas.co',
    siteName: 'Monterojas',
    locale: 'es_CO',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-ocre/30 selection:text-espresso bg-crema">
        <StoreProvider>
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
