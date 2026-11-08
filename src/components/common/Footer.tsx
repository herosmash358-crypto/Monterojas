'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, ShieldCheck, Truck, RefreshCw, HeartHandshake } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSent(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-bosque-dark text-crema border-t border-bosque/40">
      {/* Guarantees bar */}
      <div className="border-b border-bosque/40 bg-bosque/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bosque flex items-center justify-center text-ocre flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-crema font-serif">Envíos a toda Colombia</h4>
                <p className="text-xs text-salvia">Gratis en compras superiores a $90.000 COP</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bosque flex items-center justify-center text-ocre flex-shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-crema font-serif">Tostión Fresca</h4>
                <p className="text-xs text-salvia">Lotes pequeños tostados cada semana</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bosque flex items-center justify-center text-ocre flex-shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-crema font-serif">Comercio Justo Directo</h4>
                <p className="text-xs text-salvia">Compramos sin intermediarios a caficultores</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bosque flex items-center justify-center text-ocre flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-crema font-serif">Pago 100% Seguro</h4>
                <p className="text-xs text-salvia">PSE, Nequi, Tarjetas y Contra entrega</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-xs leading-relaxed text-crema/80 max-w-sm">
              Monterojas rinde homenaje a las familias caficultoras que labran las empinadas laderas de los Andes colombianos. Tostamos en origen para que cada grano conserve su alma pura de montaña.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-ocre mb-2 font-serif">
                Club de Cata & Descuento de Bienvenida
              </h4>
              <p className="text-xs text-crema/70 mb-3">
                Suscríbete y recibe un 10% de descuento en tu primer pedido con el código <strong>MONTEROJAS10</strong>.
              </p>
              {newsletterSent ? (
                <div className="flex items-center gap-2 bg-bosque text-crema px-4 py-2.5 rounded-full text-xs font-medium border border-salvia/40">
                  <CheckCircle2 className="w-4 h-4 text-ocre" />
                  <span>¡Bienvenido a la familia cafetera! Usa el cupón <strong>MONTEROJAS10</strong>.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-salvia" />
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Tu correo electrónico..."
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-bosque text-crema text-xs rounded-full border border-bosque-light focus:border-ocre focus:outline-none placeholder-salvia/70"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-ocre hover:bg-ocre-hover text-espresso text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                  >
                    Unirme
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 1: Categorías */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ocre font-serif">
              Catálogo de Café
            </h4>
            <ul className="space-y-2 text-xs text-crema/80">
              <li>
                <Link href="/categorias/cafe-en-grano" className="hover:text-ocre transition-colors">
                  Café en Grano
                </Link>
              </li>
              <li>
                <Link href="/categorias/cafe-molido" className="hover:text-ocre transition-colors">
                  Café Molido por Método
                </Link>
              </li>
              <li>
                <Link href="/categorias/cafes-de-origen" className="hover:text-ocre transition-colors">
                  Cafés de Origen (Huila, Nariño...)
                </Link>
              </li>
              <li>
                <Link href="/categorias/cafes-especiales-microlotes" className="hover:text-ocre transition-colors">
                  Micro-lotes & Geisha
                </Link>
              </li>
              <li>
                <Link href="/categorias/capsulas-monodosis" className="hover:text-ocre transition-colors">
                  Cápsulas Compostables
                </Link>
              </li>
              <li>
                <Link href="/categorias/accesorios-y-metodos" className="hover:text-ocre transition-colors">
                  Accesorios (V60, Prensas, Molinillos)
                </Link>
              </li>
              <li>
                <Link href="/categorias/kits-y-regalos" className="hover:text-ocre transition-colors">
                  Cajas de Regalo & Suscripción
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Cultura & Enlaces */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ocre font-serif">
              Cultura Cafetera
            </h4>
            <ul className="space-y-2 text-xs text-crema/80">
              <li>
                <Link href="/nuestra-historia" className="hover:text-ocre transition-colors">
                  Nuestra Historia & Fincas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-ocre transition-colors">
                  Guías de Preparación Barista
                </Link>
              </li>
              <li>
                <Link href="/blog/guia-definitiva-preparacion-v60" className="hover:text-ocre transition-colors">
                  Cómo preparar café en V60
                </Link>
              </li>
              <li>
                <Link href="/cuenta" className="hover:text-ocre transition-colors">
                  Portal de Suscriptores
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-ocre transition-colors">
                  Atención al Cliente & Cafeterías
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Ayuda */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-ocre font-serif">
              Ayuda & Garantías
            </h4>
            <ul className="space-y-2 text-xs text-crema/80">
              <li>
                <Link href="/faq" className="hover:text-ocre transition-colors">
                  Preguntas Frecuentes (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-ocre transition-colors">
                  Tiempos de Envío & Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-ocre transition-colors">
                  Términos del Servicio
                </Link>
              </li>
              <li>
                <Link href="/terminos#privacidad" className="hover:text-ocre transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-salvia block mb-1">
                Línea directa WhatsApp:
              </span>
              <p className="text-xs font-semibold text-crema">+57 310 892 4150</p>
              <p className="text-[11px] text-salvia">Lunes a Sábado: 8:00 am - 6:00 pm</p>
            </div>
          </div>
        </div>

        {/* Bottom bar with payment badges and copyright */}
        <div className="mt-12 pt-8 border-t border-bosque/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-salvia">
          <p>© {currentYear} Monterojas Café de Colombia SAS. Todos los derechos reservados.</p>
          
          {/* Simulated Payment Methods Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 bg-bosque rounded text-[10px] font-bold text-crema border border-salvia/30">
              PSE
            </span>
            <span className="px-2 py-1 bg-bosque rounded text-[10px] font-bold text-crema border border-salvia/30">
              NEQUI
            </span>
            <span className="px-2 py-1 bg-bosque rounded text-[10px] font-bold text-crema border border-salvia/30">
              BANCOLOMBIA
            </span>
            <span className="px-2 py-1 bg-bosque rounded text-[10px] font-bold text-crema border border-salvia/30">
              VISA
            </span>
            <span className="px-2 py-1 bg-bosque rounded text-[10px] font-bold text-crema border border-salvia/30">
              MASTERCARD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
