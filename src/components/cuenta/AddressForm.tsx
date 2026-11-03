'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight, ArrowLeft } from 'lucide-react';

interface AddressFormProps {
  userId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddressForm({ userId, onCancel, onSuccess }: AddressFormProps) {
  const [label, setLabel] = useState('Casa');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          label,
          name,
          phone,
          street,
          city,
          state,
          zipCode,
          isDefault,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'No se pudo crear la dirección.');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-20">
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link
          href="/cuenta/direcciones"
          onClick={() => onCancel()}
          className="hover:text-espresso"
        >
          Inicio
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <Link href="/" className="hover:text-espresso">
          Tienda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Nueva Dirección</span>
      </nav>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-lino shadow-soft space-y-5">
        <h1 className="font-serif text-3xl font-bold text-espresso">Nueva Dirección</h1>
        <p className="text-xs text-tierra mt-1">
          Agrega una dirección de envío para tus pedidos de café.
        </p>

        {error && (
          <p className="text-xs text-alerta-error bg-alerta-error/10 border border-alerta-error/30 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-tierra uppercase text-[11px]">
              Etiqueta
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej. Casa, Oficina, Mamá"
              className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-tierra uppercase text-[11px]">
              Nombre de quien recibe
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombres y apellidos"
              className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-tierra uppercase text-[11px]">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 000 0000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-tierra uppercase text-[11px]">
              Dirección completa
            </label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Calle, carrera, barrio, apartamento"
              className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-tierra uppercase text-[11px]">
                Ciudad
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Medellín"
                className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-tierra uppercase text-[11px]">
                Departamento
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Antioquia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-tierra uppercase text-[11px]">
              Código Postal (opcional)
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="050001"
              className="w-full px-3.5 py-2.5 rounded-xl bg-crema-light border border-lino focus:border-ocre outline-none text-espresso"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded text-ocre focus:ring-ocre accent-ocre w-4 h-4 mt-0.5"
            />
            <label htmlFor="isDefault" className="text-sm text-tierra font-medium cursor-pointer">
              Marcar como dirección predeterminada
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onCancel()}
              className="flex-1 py-3 rounded-xl border border-lino text-espresso font-semibold hover:bg-crema-light transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-ocre text-espresso font-semibold hover:bg-ocre-hover disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Dirección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
