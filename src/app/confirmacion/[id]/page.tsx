'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  ArrowRight,
  SearchX,
  Loader2,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ConfirmacionPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id;
  const { orders } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const order = useMemo(
    () => orders.find((o) => o.id === orderId),
    [orders, orderId]
  );

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 text-ocre animate-spin" />
        <p className="text-sm text-tierra">Verificando tu pedido…</p>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-white border border-lino shadow-soft flex items-center justify-center">
          <SearchX className="w-8 h-8 text-lino-dark" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
          No encontramos este pedido
        </h1>
        <p className="text-sm text-tierra max-w-md mx-auto leading-relaxed">
          El pedido <span className="font-semibold text-espresso">{orderId}</span> no está disponible en
          este dispositivo. Puedes revisar tu historial completo en tu cuenta.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/cuenta/pedidos"
            className="inline-flex items-center gap-2 bg-bosque text-crema font-bold text-sm px-6 py-3 rounded-full hover:bg-bosque-dark transition-colors"
          >
            <Package className="w-4 h-4" /> Ver mis pedidos
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-espresso border-2 border-lino px-6 py-3 rounded-full hover:border-ocre transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-24">
      {/* Success header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-full bg-alerta-exito/10 border-2 border-alerta-exito/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-alerta-exito" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-ocre-dark">
            ¡Pedido confirmado!
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso">
            Gracias por tostar con nosotros ☕
          </h1>
          <p className="text-sm text-tierra max-w-lg mx-auto leading-relaxed">
            Tu pedido <span className="font-bold text-espresso">{order.id}</span> fue registrado el {order.date}.
            Te enviaremos las notificaciones de tostión y despacho al correo registrado.
          </p>
        </div>
      </div>

      {/* Tracking strip */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <span className="inline-flex items-center gap-2 bg-crema-light border border-lino px-4 py-2.5 rounded-full font-semibold text-espresso">
          <Package className="w-4 h-4 text-bosque" /> Estado: {order.status}
        </span>
        <span className="inline-flex items-center gap-2 bg-crema-light border border-lino px-4 py-2.5 rounded-full font-semibold text-espresso">
          <Truck className="w-4 h-4 text-bosque" /> Guía: {order.trackingNumber}
        </span>
        <span className="inline-flex items-center gap-2 bg-crema-light border border-lino px-4 py-2.5 rounded-full font-semibold text-espresso">
          Pago: {order.paymentMethod}
        </span>
      </div>

      {/* Items summary */}
      <section className="bg-white border border-lino rounded-craft shadow-soft overflow-hidden">
        <header className="px-6 py-4 border-b border-lino bg-crema-light/60">
          <h2 className="font-serif font-bold text-lg text-espresso">Resumen del pedido</h2>
        </header>

        <div className="divide-y divide-lino">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-lino bg-crema shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-espresso truncate">{item.name}</p>
                <p className="text-xs text-tierra mt-0.5">
                  {item.weight} · {item.grind} · Cantidad: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-espresso whitespace-nowrap">
                ${(item.unitPrice * item.quantity).toLocaleString('es-CO')}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-lino bg-crema-light/60 space-y-1.5 text-sm">
          <div className="flex justify-between text-tierra">
            <span>Subtotal</span>
            <span>${order.subtotal.toLocaleString('es-CO')}</span>
          </div>
          <div className="flex justify-between text-tierra">
            <span>Envío</span>
            <span className={order.shipping === 0 ? 'font-bold text-alerta-exito' : ''}>
              {order.shipping === 0 ? 'Gratis' : `$${order.shipping.toLocaleString('es-CO')}`}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-tierra">
              <span>Descuento</span>
              <span className="font-bold text-alerta-exito">
                −${order.discount.toLocaleString('es-CO')}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-lino font-serif text-lg font-bold text-espresso">
            <span>Total</span>
            <span>${order.total.toLocaleString('es-CO')} COP</span>
          </div>
        </div>
      </section>

      {/* Shipping address */}
      <section className="bg-white border border-lino rounded-craft shadow-soft p-6 space-y-3">
        <h2 className="font-serif font-bold text-lg text-espresso flex items-center gap-2">
          <MapPin className="w-5 h-5 text-bosque" /> Dirección de entrega
        </h2>
        <div className="text-sm text-tierra space-y-1 leading-relaxed">
          <p className="font-semibold text-espresso">{order.shippingAddress.fullName}</p>
          <p>
            {order.shippingAddress.street}, {order.shippingAddress.city}
          </p>
          <p>{order.shippingAddress.department} · Tel: {order.shippingAddress.phone}</p>
          {order.shippingAddress.notes && (
            <p className="text-xs italic text-tierra/70">Nota: {order.shippingAddress.notes}</p>
          )}
        </div>
      </section>

      {/* What's next */}
      <section className="bg-bosque text-crema rounded-craft p-6 sm:p-8 space-y-3">
        <h2 className="font-serif text-xl font-bold">¿Qué pasa ahora?</h2>
        <ol className="space-y-2.5 text-sm text-crema/90">
          <li className="flex gap-3">
            <span className="font-serif font-bold text-ocre">1.</span>
            <span>Tostamos tu café fresco esta semana — nada se almacena viejo en bodega.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-serif font-bold text-ocre">2.</span>
            <span>Moleremos al momento si lo pediste molido, y lo sellamos con válvula de un sentido.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-serif font-bold text-ocre">3.</span>
            <span>Despachamos con guía <strong>{order.trackingNumber}</strong>; llega en 1–3 días hábiles.</span>
          </li>
        </ol>
      </section>

      {/* CTAs */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Link
          href="/cuenta/pedidos"
          className="inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-sm px-7 py-3.5 rounded-full hover:bg-ocre-hover transition-colors shadow-sm"
        >
          Rastrear mi pedido <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-espresso border-2 border-lino px-7 py-3.5 rounded-full hover:border-ocre transition-colors"
        >
          Seguir explorando
        </Link>
      </div>
    </div>
  );
}
