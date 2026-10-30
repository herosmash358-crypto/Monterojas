'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const COLOMBIAN_CITIES = [
  { city: 'Bogotá D.C.', department: 'Cundinamarca', shippingCost: 10000 },
  { city: 'Medellín', department: 'Antioquia', shippingCost: 8000 },
  { city: 'Cali', department: 'Valle del Cauca', shippingCost: 12000 },
  { city: 'Barranquilla', department: 'Atlántico', shippingCost: 14000 },
  { city: 'Bucaramanga', department: 'Santander', shippingCost: 12000 },
  { city: 'Pasto', department: 'Nariño', shippingCost: 14000 },
  { city: 'Neiva', department: 'Huila', shippingCost: 12000 },
  { city: 'Manizales', department: 'Caldas', shippingCost: 10000 },
  { city: 'Pereira', department: 'Risaralda', shippingCost: 10000 },
  { city: 'Armenia', department: 'Quindío', shippingCost: 10000 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    appliedDiscount,
    couponCode,
    user,
    createOrder,
  } = useStore();

  // Form State
  const [email, setEmail] = useState(user?.email || 'cliente@monterojas.co');
  const [fullName, setFullName] = useState(user?.name || 'Carlos Alberto Gómez');
  const [phone, setPhone] = useState(user?.phone || '+57 310 495 8291');
  const [street, setStreet] = useState('Carrera 43A # 18 Sur - 125 Apto 502');
  const [city, setCity] = useState(COLOMBIAN_CITIES[0].city);
  const [department, setDepartment] = useState(COLOMBIAN_CITIES[0].department);
  const [notes, setNotes] = useState('Dejar en recepción si no contesto.');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'Tarjeta de Crédito' | 'PSE' | 'Nequi' | 'Contra entrega'>('Tarjeta de Crédito');
  const [cardHolder, setCardHolder] = useState('Carlos Alberto Gómez');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('841');
  const [pseBank, setPseBank] = useState('Bancolombia');
  const [nequiPhone, setNequiPhone] = useState('3104958291');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    const found = COLOMBIAN_CITIES.find((c) => c.city === cityName);
    if (found) setDepartment(found.department);
  };

  const shippingCost = cartSubtotal >= 90000 || cartSubtotal === 0 ? 0 : 12000;
  const totalAmount = Math.max(0, cartSubtotal + shippingCost - appliedDiscount);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.includes('@')) errs.email = 'Ingresa un correo electrónico válido.';
    if (!fullName.trim()) errs.fullName = 'Ingresa tu nombre y apellido.';
    if (!street.trim()) errs.street = 'Ingresa tu dirección de entrega.';
    if (!phone.trim()) errs.phone = 'Ingresa tu teléfono de contacto.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        status: 'Confirmado',
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          weight: item.variantWeight,
          grind: item.grind,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
        subtotal: cartSubtotal,
        shipping: shippingCost,
        discount: appliedDiscount,
        total: totalAmount,
        paymentMethod,
        shippingAddress: {
          fullName,
          street,
          city,
          department,
          phone,
          notes,
        },
      });

      router.push(`/confirmacion/${newOrder.id}`);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-espresso mb-3">
          No tienes productos en el carrito para comprar
        </h1>
        <p className="text-sm text-tierra mb-6">
          Agrega algunos granos especiales o métodos para continuar con tu pedido.
        </p>
        <Link
          href="/categorias/cafe-en-grano"
          className="inline-flex items-center gap-2 bg-ocre text-espresso font-bold text-sm px-6 py-3 rounded-full hover:bg-ocre-hover"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header breadcrumb & Secure banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-lino gap-3">
        <nav className="flex items-center gap-2 text-xs text-tierra">
          <Link href="/carrito" className="hover:text-espresso">
            Carrito
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="font-bold text-espresso">Finalizar Compra Segura</span>
        </nav>
        <div className="flex items-center gap-1.5 text-xs text-bosque font-semibold bg-salvia/40 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5" />
          <span>Checkout Encriptado 256-bit SSL</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: The 3 Simple Steps (Shipping, Payment, Account) */}
        <div className="lg:col-span-7 space-y-8">
          {/* STEP 1: Datos de Contacto y Envío */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-lino shadow-soft space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-lino">
              <div className="w-8 h-8 rounded-full bg-ocre text-espresso font-bold flex items-center justify-center text-xs">
                1
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-espresso">
                  Datos de Contacto y Destino
                </h2>
                <p className="text-xs text-tierra">
                  {user ? `Comprando como ${user.name}` : 'Compra rápida como invitado o inicia sesión'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-tierra uppercase">Correo Electrónico (para confirmación de guía)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                />
                {errors.email && <p className="text-alerta-error text-[11px]">{errors.email}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-tierra uppercase">Nombre Completo de Quien Recibe</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nombres y Apellidos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                />
                {errors.fullName && <p className="text-alerta-error text-[11px]">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-tierra uppercase">Teléfono Móvil / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+57 300 000 0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-tierra uppercase">Ciudad de Entrega</label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso cursor-pointer"
                >
                  {COLOMBIAN_CITIES.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city} ({c.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-tierra uppercase">Dirección Completa (Calle, Carrera, Barrio, Apto)</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Ej. Calle 123 # 45 - 67 Torre 2 Apto 801"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                />
                {errors.street && <p className="text-alerta-error text-[11px]">{errors.street}</p>}
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-tierra uppercase">Instrucciones Adicionales (Opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Dejar en portería o timbrar antes de subir"
                  className="w-full px-3.5 py-2 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: Método de Pago Simulado */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-lino shadow-soft space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-lino">
              <div className="w-8 h-8 rounded-full bg-ocre text-espresso font-bold flex items-center justify-center text-xs">
                2
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-espresso">
                  Método de Pago
                </h2>
                <p className="text-xs text-tierra">
                  Integración lista para pasarela Wompi / MercadoPago
                </p>
              </div>
            </div>

            {/* Selector de métodos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Tarjeta de Crédito', label: 'Tarjeta Crédito', icon: <CreditCard className="w-4 h-4 text-ocre" /> },
                { id: 'PSE', label: 'PSE Débito', icon: <Building className="w-4 h-4 text-bosque" /> },
                { id: 'Nequi', label: 'Nequi', icon: <Smartphone className="w-4 h-4 text-purple-700" /> },
                { id: 'Contra entrega', label: 'Contra Entrega', icon: <Truck className="w-4 h-4 text-tierra" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-2xl border text-center text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === m.id
                      ? 'border-ocre bg-crema-light ring-2 ring-ocre/30 text-espresso font-bold shadow-sm'
                      : 'border-lino bg-white text-tierra hover:bg-crema-light'
                  }`}
                >
                  {m.icon}
                  <span className="text-[11px] leading-tight">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Payment Details */}
            <div className="p-4 bg-crema-light rounded-2xl border border-lino space-y-3 text-xs">
              {paymentMethod === 'Tarjeta de Crédito' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-tierra uppercase">Titular de la Tarjeta</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full p-2 rounded-lg bg-white border border-lino text-espresso"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="font-bold text-tierra uppercase">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-lino text-espresso font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-tierra uppercase">Vencimiento</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-lino text-espresso text-center font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'PSE' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-tierra uppercase">Selecciona tu Banco (PSE)</label>
                    <select
                      value={pseBank}
                      onChange={(e) => setPseBank(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-white border border-lino text-espresso cursor-pointer"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                      <option value="BBVA Colombia">BBVA Colombia</option>
                      <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                      <option value="Lulo Bank">Lulo Bank</option>
                      <option value="Nu Colombia">Nu Colombia (Cuenta de ahorros)</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-tierra">
                    Serás redirigido a la pasarela bancaria oficial para autorizar la transacción de forma inmediata.
                  </p>
                </div>
              )}

              {paymentMethod === 'Nequi' && (
                <div className="space-y-2">
                  <label className="font-bold text-tierra uppercase">Número Nequi para Notificación Push</label>
                  <input
                    type="tel"
                    value={nequiPhone}
                    onChange={(e) => setNequiPhone(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-lino text-espresso font-mono"
                  />
                  <p className="text-[11px] text-tierra">
                    Recibirás una notificación en tu app Nequi para autorizar el pago con tu clave o biometría.
                  </p>
                </div>
              )}

              {paymentMethod === 'Contra entrega' && (
                <div className="p-3 bg-white rounded-xl border border-lino text-xs text-tierra space-y-1">
                  <p className="font-bold text-espresso">Pago al Recibir en Efectivo o Datafono Móvil</p>
                  <p className="text-[11px]">
                    El transportador te entregará tu paquete y podrás pagar en efectivo con el valor exacto o tarjeta de débito/crédito.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (Always visible & interactive) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-lino shadow-card space-y-5 sticky top-28">
            <h3 className="font-serif text-lg font-bold text-espresso pb-3 border-b border-lino">
              Tu Pedido ({cart.reduce((a, b) => a + b.quantity, 0)} ítems)
            </h3>

            {/* Cart items preview list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-crema flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-espresso truncate">{item.name}</p>
                    <p className="text-[11px] text-tierra">{item.variantWeight} · {item.grind} (x{item.quantity})</p>
                  </div>
                  <div className="font-bold text-espresso text-right">
                    ${(item.unitPrice * item.quantity).toLocaleString('es-CO')}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-tierra pt-3 border-t border-lino">
              <div className="flex justify-between">
                <span>Subtotal café</span>
                <span className="font-semibold text-espresso">${cartSubtotal.toLocaleString('es-CO')} COP</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-bosque font-semibold">
                  <span>Descuento ({couponCode})</span>
                  <span>-${appliedDiscount.toLocaleString('es-CO')} COP</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Flete de envío ({city})</span>
                <span>
                  {shippingCost === 0 ? (
                    <strong className="text-bosque font-bold">GRATIS</strong>
                  ) : (
                    `$${shippingCost.toLocaleString('es-CO')} COP`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-lg font-serif font-bold text-espresso pt-3 border-t border-lino">
                <span>Total a Pagar</span>
                <span className="text-ocre-dark">${totalAmount.toLocaleString('es-CO')} COP</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-ocre hover:bg-ocre-hover text-espresso font-bold py-4 rounded-full shadow-lg transition-all text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Procesando pago seguro...</span>
              ) : (
                <>
                  <span>Confirmar Pedido y Pagar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-tierra/80 space-y-1">
              <p>Al hacer clic en &quot;Confirmar Pedido&quot; aceptas nuestros términos de servicio y política de privacidad.</p>
              <p className="font-semibold text-bosque flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Despacho programado en 24 a 48 horas hábiles
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
