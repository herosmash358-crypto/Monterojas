'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function OrdersPage() {
  const { orders } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <Link href="/cuenta" className="hover:text-espresso">
          Mi Cuenta
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Mis Pedidos</span>
      </nav>

      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Historial de Pedidos y Seguimiento
        </h1>
        <p className="text-xs text-tierra mt-1">
          Revisa el estado de tostión y la guía de despacho de tus cafés de origen.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="bg-white rounded-3xl border border-lino p-6 sm:p-8 shadow-soft space-y-4"
          >
            {/* Order header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-lino gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-espresso">{ord.id}</span>
                <span className="bg-salvia/40 text-bosque font-bold px-2.5 py-1 rounded-full text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {ord.status}
                </span>
              </div>
              <div className="text-tierra">
                Fecha: <strong className="text-espresso font-semibold">{ord.date}</strong> · Guía:{' '}
                <span className="font-mono text-bosque font-semibold">{ord.trackingNumber}</span>
              </div>
            </div>

            {/* Items in order */}
            <div className="space-y-3">
              {ord.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-xs">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-crema flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-espresso truncate">{item.name}</h4>
                    <p className="text-tierra mt-0.5">{item.weight} · {item.grind} (x{item.quantity})</p>
                  </div>
                  <div className="font-bold text-espresso">
                    ${(item.unitPrice * item.quantity).toLocaleString('es-CO')} COP
                  </div>
                </div>
              ))}
            </div>

            {/* Order footer */}
            <div className="pt-4 border-t border-lino flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-tierra">
                Entrega en: <strong className="text-espresso font-semibold">{ord.shippingAddress.street}, {ord.shippingAddress.city}</strong>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-tierra/70 block">Total</span>
                  <span className="font-serif font-bold text-base text-ocre-dark">
                    ${ord.total.toLocaleString('es-CO')} COP
                  </span>
                </div>
                <Link
                  href={`/confirmacion/${ord.id}`}
                  className="bg-crema hover:bg-ocre hover:text-espresso text-tierra font-bold px-4 py-2 rounded-full text-xs transition-colors"
                >
                  Ver Recibo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
