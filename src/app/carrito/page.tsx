'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartShipping,
    cartTotal,
    freeShippingProgress,
    amountUntilFreeShipping,
    couponCode,
    appliedDiscount,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-crema-dark rounded-full mx-auto flex items-center justify-center text-tierra mb-6">
          <ShoppingBag className="w-10 h-10 opacity-60" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-espresso mb-3">
          Tu carrito de compras está vacío
        </h1>
        <p className="text-sm text-tierra max-w-md mx-auto mb-8 leading-relaxed">
          Explora nuestros granos recién tostados de Huila, Nariño y Cauca, o descubre los métodos de preparación barista.
        </p>
        <Link
          href="/categorias/cafe-en-grano"
          className="inline-flex items-center gap-2 bg-ocre hover:bg-ocre-hover text-espresso font-bold text-sm px-8 py-4 rounded-full shadow-md transition-all uppercase tracking-wider"
        >
          Explorar Cafés en Grano <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/" className="hover:text-espresso">
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Carrito de Compras</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-lino gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Carrito de Compras
          </h1>
          <p className="text-xs text-tierra mt-1">
            {cart.reduce((a, b) => a + b.quantity, 0)} productos listos para despacho
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-tierra hover:text-alerta-error flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Vaciar carrito
        </button>
      </div>

      {/* Free Shipping Alert Box */}
      <div className="p-4 bg-crema-dark rounded-2xl border border-lino text-xs">
        <div className="flex items-center justify-between font-semibold text-espresso mb-2">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-bosque" />
            {freeShippingProgress >= 100 ? (
              <span className="text-bosque font-bold">¡Calificas para Envío Gratis a toda Colombia!</span>
            ) : (
              <span>
                Agrega <strong className="text-tierra font-bold">${amountUntilFreeShipping.toLocaleString('es-CO')} COP</strong> más para obtener envío gratis
              </span>
            )}
          </span>
          <span className="font-bold text-bosque">{freeShippingProgress}%</span>
        </div>
        <div className="w-full h-2.5 bg-crema rounded-full overflow-hidden">
          <div
            className="h-full bg-bosque transition-all duration-500 rounded-full"
            style={hasMounted ? { width: `${freeShippingProgress}%` } : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-2xl border border-lino shadow-soft"
            >
              {/* Product Thumbnail */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-crema flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/producto/${item.productSlug}`}
                  className="font-serif font-bold text-base text-espresso hover:text-ocre transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-tierra mt-0.5">
                  Presentación: <strong>{item.variantWeight}</strong> · Molienda: <strong>{item.grind}</strong>
                </p>
                <p className="text-xs text-tierra/70 mt-1">
                  Precio unitario: ${item.unitPrice.toLocaleString('es-CO')} COP
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-lino rounded-full bg-crema-light px-2 py-1">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:text-ocre text-tierra transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-espresso">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:text-ocre text-tierra transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-2">
                <span className="font-serif text-base font-bold text-espresso">
                  ${(item.unitPrice * item.quantity).toLocaleString('es-CO')} COP
                </span>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="text-espresso/40 hover:text-alerta-error text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/categorias/cafe-en-grano"
              className="text-xs font-bold text-ocre hover:text-ocre-dark uppercase tracking-wider inline-flex items-center gap-1"
            >
              &larr; Continuar comprando más café
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-lino shadow-card space-y-5">
            <h3 className="font-serif text-lg font-bold text-espresso pb-3 border-b border-lino">
              Resumen del Pedido
            </h3>

            {/* Coupon form */}
            <form onSubmit={handleApply} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-tierra/60" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código de cupón"
                    className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-crema-light border border-lino rounded-xl focus:border-ocre outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-tierra hover:bg-tierra-dark text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Aplicar
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs ${couponMsg.success ? 'text-bosque font-medium' : 'text-alerta-error'}`}>
                  {couponMsg.text}
                </p>
              )}
              {couponCode && (
                <div className="flex items-center justify-between bg-salvia/30 text-bosque px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {couponCode} (-${appliedDiscount.toLocaleString('es-CO')})
                  </span>
                  <button type="button" onClick={removeCoupon} className="text-espresso/60 hover:text-espresso font-bold">
                    ×
                  </button>
                </div>
              )}
            </form>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs text-tierra pt-2 border-t border-lino">
              <div className="flex justify-between">
                <span>Subtotal productos</span>
                <span className="font-semibold text-espresso">
                  ${cartSubtotal.toLocaleString('es-CO')} COP
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-bosque font-semibold">
                  <span>Descuento aplicado</span>
                  <span>-${appliedDiscount.toLocaleString('es-CO')} COP</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Costo de envío estimado</span>
                <span>
                  {cartShipping === 0 ? (
                    <strong className="text-bosque font-bold">GRATIS</strong>
                  ) : (
                    `$${cartShipping.toLocaleString('es-CO')} COP`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-serif font-bold text-espresso pt-3 border-t border-lino">
                <span>Total a Pagar</span>
                <span className="text-ocre-dark">${cartTotal.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            {/* Checkout Action */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-ocre hover:bg-ocre-hover text-espresso font-bold py-4 rounded-full shadow-lg transition-all text-sm uppercase tracking-wider"
            >
              Iniciar Checkout Seguro <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="pt-2 text-center text-xs text-tierra flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-bosque" />
              <span>Transacciones encriptadas con cifrado SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
