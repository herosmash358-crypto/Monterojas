import React from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronRight, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    category: 'Tostión y Frescura',
    items: [
      {
        q: '¿Con qué frecuencia tuestan el café?',
        a: 'Tostamos cada semana en pequeños lotes de 15 kg para garantizar que recibes un grano recién desgasificado y cargado de aromas.',
      },
      {
        q: '¿Cómo debo conservar el café en mi hogar?',
        a: 'Mantén la bolsa original con su válvula desgasificadora cerrada con el zipper en un lugar fresco, seco y oscuro. Nunca lo guardes en el refrigerador.',
      },
      {
        q: '¿Qué fecha de vencimiento tiene?',
        a: 'El café en grano conserva su pico óptimo aromático durante los primeros 90 días posteriores al tueste. Aún después de 6 meses sigue siendo seguro para el consumo.',
      },
    ],
  },
  {
    category: 'Moliendas y Métodos',
    items: [
      {
        q: '¿Qué molienda elijo si uso cafetera italiana (moka)?',
        a: 'Selecciona Molienda Fina. Ofrece la resistencia correcta al vapor para generar una crema densa y avellanada.',
      },
      {
        q: '¿Qué molienda es mejor para Prensa Francesa o Cold Brew?',
        a: 'Selecciona Molienda Gruesa. Esto evita que los finos pasen a través del émbolo y previene la sobreextracción astringente.',
      },
      {
        q: '¿Para V60 y Chemex?',
        a: 'Selecciona Molienda Media. El flujo de goteo en papel será uniforme, tardando entre 2:45 y 3:15 minutos.',
      },
    ],
  },
  {
    category: 'Envíos y Pagos',
    items: [
      {
        q: '¿Cuánto demora el despacho?',
        a: 'A ciudades principales (Bogotá, Medellín, Cali, Barranquilla, Bucaramanga) llega en 24 a 48 horas hábiles. Para otros municipios toma entre 3 y 5 días.',
      },
      {
        q: '¿Tienen envío gratis?',
        a: 'Sí, todas las órdenes superiores a $90.000 COP cuentan con flete gratis a nivel nacional.',
      },
      {
        q: '¿Qué medios de pago aceptan?',
        a: 'Tarjeta de Crédito (Visa, Mastercard, Amex), débito bancario PSE, Nequi y pago contra entrega en efectivo o datáfono móvil.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Preguntas Frecuentes</span>
      </nav>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-tierra flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-ocre" /> Centro de Ayuda
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mt-1">
          Preguntas Frecuentes
        </h1>
        <p className="text-xs sm:text-sm text-tierra mt-2">
          Resolvemos tus dudas sobre tostión, moliendas, tiempos de entrega y preparación.
        </p>
      </div>

      <div className="space-y-8">
        {FAQS.map((section, idx) => (
          <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-lino shadow-soft space-y-4">
            <h2 className="font-serif font-bold text-xl text-espresso border-b border-lino pb-3">
              {section.category}
            </h2>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="p-4 bg-crema-light/50 rounded-2xl border border-lino/60 space-y-1.5">
                  <h3 className="font-serif font-bold text-sm text-espresso">
                    {item.q}
                  </h3>
                  <p className="text-xs text-tierra leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-crema-dark rounded-3xl border border-lino text-center space-y-3">
        <h3 className="font-serif font-bold text-lg text-espresso">
          ¿No encontraste la respuesta que buscabas?
        </h3>
        <p className="text-xs text-tierra max-w-sm mx-auto">
          Escríbenos a nuestra línea directa de WhatsApp y con gusto un barista te asesorará.
        </p>
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-ocre-hover"
        >
          Contactar a un Barista <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
