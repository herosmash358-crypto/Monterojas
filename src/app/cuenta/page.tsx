'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  MapPin,
  Coffee,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AccountPage() {
  const { user, orders, wishlist, logout, updateProfile } = useStore();

  const [isEditingFlavor, setIsEditingFlavor] = useState(false);
  const [flavorPrefs, setFlavorPrefs] = useState<string[]>(
    user?.flavorPreferences || ['Panela', 'Caramelo', 'Jazmín']
  );

  const ALL_FLAVORS = [
    'Panela',
    'Chocolate',
    'Caramelo',
    'Jazmín',
    'Mandarina',
    'Durazno',
    'Mora',
    'Avellana',
    'Miel',
    'Frutos rojos',
  ];

  const toggleFlavor = (flavor: string) => {
    const updated = flavorPrefs.includes(flavor)
      ? flavorPrefs.filter((f) => f !== flavor)
      : [...flavorPrefs, flavor];
    setFlavorPrefs(updated);
    updateProfile({ flavorPreferences: updated });
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-crema-dark rounded-full mx-auto flex items-center justify-center text-tierra">
          <User className="w-8 h-8 opacity-60" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-espresso">
          Inicia Sesión en Monterojas
        </h1>
        <p className="text-xs text-tierra leading-relaxed">
          Accede para ver el seguimiento de tus pedidos de café fresco, direcciones guardadas y lista de deseos.
        </p>
        <Link
          href="/"
          className="inline-block bg-ocre hover:bg-ocre-hover text-espresso font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all"
        >
          Ir al Inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lino shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-bosque text-ocre flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0">
            {user.name[0]}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-bosque block">
              Club de Café Monterojas
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              {user.name}
            </h1>
            <p className="text-xs text-tierra">{user.email} · {user.phone}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="text-xs text-tierra/70 hover:text-alerta-error flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </div>

      {/* Navigation Quick Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/cuenta/pedidos"
          className="p-5 bg-white rounded-2xl border border-lino hover:border-ocre hover:shadow-soft transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <Package className="w-6 h-6 text-ocre group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg text-espresso">{orders.length}</span>
          </div>
          <div className="mt-4">
            <span className="font-serif font-bold text-sm text-espresso block">Mis Pedidos</span>
            <span className="text-[11px] text-tierra">Seguimiento y compras</span>
          </div>
        </Link>

        <Link
          href="/cuenta/favoritos"
          className="p-5 bg-white rounded-2xl border border-lino hover:border-ocre hover:shadow-soft transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <Heart className="w-6 h-6 text-alerta-error group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg text-espresso">{wishlist.length}</span>
          </div>
          <div className="mt-4">
            <span className="font-serif font-bold text-sm text-espresso block">Favoritos</span>
            <span className="text-[11px] text-tierra">Lotes que te encantan</span>
          </div>
        </Link>

        <Link
          href="/cuenta/direcciones"
          className="p-5 bg-white rounded-2xl border border-lino hover:border-ocre hover:shadow-soft transition-all group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <MapPin className="w-6 h-6 text-bosque group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg text-espresso">1</span>
          </div>
          <div className="mt-4">
            <span className="font-serif font-bold text-sm text-espresso block">Direcciones</span>
            <span className="text-[11px] text-tierra">{user.city}</span>
          </div>
        </Link>

        <div className="p-5 bg-crema-dark rounded-2xl border border-lino flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Coffee className="w-6 h-6 text-tierra" />
            <span className="font-bold text-xs bg-salvia/40 text-bosque px-2 py-0.5 rounded-full">
              Activo
            </span>
          </div>
          <div className="mt-4">
            <span className="font-serif font-bold text-sm text-espresso block">Suscripción</span>
            <span className="text-[11px] text-tierra">Plan 2x250g mensual</span>
          </div>
        </div>
      </div>

      {/* Flavor Profile Preferences Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lino shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-tierra">
              Tu Paladar Cafetero
            </span>
            <h2 className="font-serif text-xl font-bold text-espresso mt-0.5">
              Preferencias Sensoriales Guardadas
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsEditingFlavor(!isEditingFlavor)}
            className="text-xs font-bold text-ocre hover:underline"
          >
            {isEditingFlavor ? 'Listo' : 'Editar preferencias'}
          </button>
        </div>

        <p className="text-xs text-tierra">
          Personalizamos las recomendaciones de nuestra tostaduría según los perfiles que seleccionas:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {ALL_FLAVORS.map((flavor) => {
            const isSelected = flavorPrefs.includes(flavor);
            return (
              <button
                key={flavor}
                type="button"
                disabled={!isEditingFlavor}
                onClick={() => toggleFlavor(flavor)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                  isSelected
                    ? 'bg-ocre text-espresso font-bold border-ocre shadow-xs'
                    : 'bg-crema-light text-tierra border-lino'
                } ${isEditingFlavor ? 'cursor-pointer hover:border-ocre' : 'cursor-default'}`}
              >
                {flavor} {isSelected && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lino shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-lino">
          <h2 className="font-serif font-bold text-xl text-espresso">
            Últimos Pedidos
          </h2>
          <Link href="/cuenta/pedidos" className="text-xs font-bold text-ocre hover:underline flex items-center gap-1">
            Ver historial completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {orders.slice(0, 2).map((ord) => (
            <div
              key={ord.id}
              className="p-4 bg-crema-light/60 rounded-2xl border border-lino flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-espresso">{ord.id}</span>
                  <span className="bg-salvia/40 text-bosque font-bold px-2 py-0.5 rounded-full text-[10px]">
                    {ord.status}
                  </span>
                </div>
                <p className="text-tierra mt-1">
                  {ord.date} · {ord.items.length} productos · Guía: <strong>{ord.trackingNumber}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <span className="font-serif font-bold text-sm text-espresso">
                  ${ord.total.toLocaleString('es-CO')} COP
                </span>
                <Link
                  href={`/confirmacion/${ord.id}`}
                  className="px-3.5 py-1.5 rounded-full bg-crema text-tierra font-semibold hover:bg-ocre hover:text-espresso transition-colors text-xs"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
