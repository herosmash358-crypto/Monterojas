import React from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Envíos y Devoluciones</span>
      </nav>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-tierra flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-bosque" /> Logística Nacional
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mt-1">
          Políticas de Envío & Garantía de Frescura
        </h1>
        <p className="text-xs sm:text-sm text-tierra mt-2">
          Despachamos desde Medellín a cualquier rincón de Colombia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-lino shadow-soft space-y-2">
          <span className="font-serif text-2xl font-bold text-bosque block">24 - 48h</span>
          <h3 className="font-serif font-bold text-sm text-espresso">Ciudades Principales</h3>
          <p className="text-xs text-tierra">Bogotá, Medellín, Cali, Barranquilla, Bucaramanga y Eje Cafetero.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-lino shadow-soft space-y-2">
          <span className="font-serif text-2xl font-bold text-ocre-dark block">Gratis</span>
          <h3 className="font-serif font-bold text-sm text-espresso">Desde $90.000 COP</h3>
          <p className="text-xs text-tierra">En compras inferiores a este valor, el flete es de $10.000 a $14.000 según la ciudad.</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-lino shadow-soft space-y-2">
          <span className="font-serif text-2xl font-bold text-espresso block">100%</span>
          <h3 className="font-serif font-bold text-sm text-espresso">Garantía de Satisfacción</h3>
          <p className="text-xs text-tierra">Si el café presenta algún defecto de tueste o daño en el viaje, te lo reemplazamos sin costo.</p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white p-8 rounded-3xl border border-lino shadow-soft space-y-6 text-xs sm:text-sm text-tierra leading-relaxed">
        <h2 className="font-serif font-bold text-xl text-espresso">
          Detalles de los Despachos
        </h2>
        <p>
          Tostamos lotes pequeños semanalmente. Todos los pedidos realizados antes de las 12:00 PM se entregan a la transportadora (Coordinadora o Servientrega) el mismo día hábil.
        </p>
        <p>
          Recibirás en tu correo electrónico un enlace directo para rastrear la guía en tiempo real desde el momento en que el camión sale de nuestra tostaduría.
        </p>

        <h3 className="font-serif font-bold text-lg text-espresso pt-3 border-t border-lino">
          Política de Reemplazos y Devoluciones
        </h3>
        <p>
          Por ser un producto alimenticio perecedero, no aceptamos devoluciones de bolsas abiertas a menos que presenten una anomalía demostrable de calidad. Si tu pedido llega golpeado o abierto por la transportadora, toma una fotografía y contáctanos de inmediato por WhatsApp: te enviaremos una bolsa de reemplazo nueva sin costo adicional.
        </p>
      </div>
    </div>
  );
}
