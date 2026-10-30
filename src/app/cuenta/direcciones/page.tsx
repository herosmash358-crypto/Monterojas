'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight, CheckCircle2, Plus } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AddressesPage() {
  const { user } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
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
        <span className="font-bold text-espresso">Direcciones Guardadas</span>
      </nav>

      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Direcciones de Envío
        </h1>
        <p className="text-xs text-tierra mt-1">
          Gestiona los destinos para tus despachos recurrentes de café.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Default Address Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-ocre shadow-soft space-y-3 relative">
          <span className="bg-ocre text-espresso text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
            Predeterminada
          </span>

          <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
            <MapPin className="w-4 h-4 text-bosque" /> Casa Principal
          </h3>

          <div className="text-xs text-tierra space-y-1">
            <p className="font-semibold text-espresso">{user?.name || 'Carlos Alberto Gómez'}</p>
            <p>Carrera 43A # 18 Sur - 125 Apto 502</p>
            <p>El Poblado, {user?.city || 'Medellín'} ({user?.department || 'Antioquia'})</p>
            <p className="pt-1">Tel: {user?.phone || '+57 310 495 8291'}</p>
          </div>
        </div>

        {/* Add Address Card */}
        <div className="bg-crema-dark rounded-3xl p-6 border border-dashed border-lino flex flex-col items-center justify-center text-center space-y-2 min-h-[180px]">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tierra shadow-xs">
            <Plus className="w-5 h-5 text-ocre" />
          </div>
          <span className="font-serif font-bold text-sm text-espresso">
            Agregar Nueva Dirección
          </span>
          <p className="text-[11px] text-tierra max-w-xs">
            Guarda la oficina o la casa de un ser querido para enviar regalos de café.
          </p>
        </div>
      </div>
    </div>
  );
}
