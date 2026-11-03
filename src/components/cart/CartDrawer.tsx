'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Tag, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
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
  const [couponMessage, setCouponMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, success: res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-espresso/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-crema-light flex flex-col shadow-2xl border-l border-lino animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-lino bg-crema flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-ocre/20 flex items-center justify-center text-ocre">
                <ShoppingBag className="w-5 h-5 text-ocre-dark" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-espresso">Tu Carrito</h2>
                <p className="text-xs text-tierra">
                  {cart.length === 0 ? 'Vacío' : `${cart.reduce((a, b) => a + b.quantity, 0)} artículos seleccionados`}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-tierra hover:bg-lino hover:text-espresso transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-lino/60 p-4 border-b border-lino text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-espresso">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-bosque" />
                {freeShippingProgress >= 100 ? (
                  <span className="text-bosque font-bold">¡Genial! Tienes Envío Gratis a toda Colombia</span>
                ) : (
                  <span>
                    Te faltan <strong className="text-tierra font-bold">${amountUntilFreeShipping.toLocaleString('es-CO')} COP</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="font-bold text-bosque">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-crema rounded-full overflow-hidden">
              <div
                className="h-full bg-bosque transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-lino mx-auto flex items-center justify-center text-tierra mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-xl font-bold text-espresso mb-2">Tu carrito está vacío</h3>
                <p className="text-sm text-tierra mb-6">
                  Descubre los granos y micro-lotes más frescos cosechados en las montañas de Colombia.
                </p>
                <button
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-ocre text-espresso font-semibold px-6 py-3 rounded-full hover:bg-ocre-hover shadow-md transition-all"
                >
                  Explorar la Tienda <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white rounded-2xl border border-lino shadow-sm relative group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-lino flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-espresso truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-tierra mt-0.5">
                      {item.variantWeight} · {item.grind}
                    </p>
                    <p className="font-bold text-sm text-tierra mt-1.5">
                      ${(item.unitPrice * item.quantity).toLocaleString('es-CO')} COP
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center border border-lino rounded-full bg-crema">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-ocre text-tierra transition-colors"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-espresso">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-ocre text-tierra transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-espresso/40 hover:text-alerta-error p-1 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-lino bg-white space-y-3.5 shadow-lg">
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-tierra/60" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Cupón (ej. MONTEROJAS10)"
                    className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-crema-light border border-lino rounded-xl focus:border-ocre outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tierra text-white text-xs font-semibold rounded-xl hover:bg-tierra-dark transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {/* Coupon message */}
              {couponMessage && (
                <p className={`text-xs ${couponMessage.success ? 'text-bosque font-medium' : 'text-alerta-error'}`}>
                  {couponMessage.text}
                </p>
              )}

              {couponCode && (
                <div className="flex items-center justify-between bg-salvia/30 text-bosque px-3 py-1.5 rounded-lg text-xs font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {couponCode} aplicado (-${appliedDiscount.toLocaleString('es-CO')})
                  </span>
                  <button onClick={removeCoupon} className="text-espresso/60 hover:text-espresso font-bold">
                    ×
                  </button>
                </div>
              )}

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-tierra pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-espresso">${cartSubtotal.toLocaleString('es-CO')} COP</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-bosque font-medium">
                    <span>Descuento</span>
                    <span>-${appliedDiscount.toLocaleString('es-CO')} COP</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío estimado</span>
                  <span>{cartShipping === 0 ? <strong className="text-bosque">GRATIS</strong> : `$${cartShipping.toLocaleString('es-CO')} COP`}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-espresso pt-2 border-t border-lino">
                  <span>Total</span>
                  <span className="text-ocre-dark">${cartTotal.toLocaleString('es-CO')} COP</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-ocre text-espresso font-bold py-3.5 rounded-full hover:bg-ocre-hover shadow-card transition-all text-sm uppercase tracking-wider"
                >
                  Proceder al Pago <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/carrito"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center text-xs font-semibold text-tierra hover:text-espresso py-1.5 transition-colors"
                >
                  Ver carrito detallado
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
