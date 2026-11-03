'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight, Trash2, Edit, CheckCircle2, Plus } from 'lucide-react';
import Image from 'next/image';

interface AddressUI {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
}

interface AddressesListProps {
  addresses: AddressUI[];
  userId: string;
  onRefresh?: () => void;
}

export default function AddressesList({ addresses, userId, onRefresh }: AddressesListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Default Address Card */}
      {addresses.length > 0 && (
        <>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl p-6 shadow-soft space-y-3 relative ${
                addr.isDefault ? 'border-2 border-ocre' : 'border border-lino'
              }`}
            >
              {addr.isDefault && (
                <span className="bg-ocre text-espresso text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full inline-block">
                  Predeterminada
                </span>
              )}

              <h3 className="font-serif font-bold text-base text-espresso flex items-center gap-2">
                <MapPin className="w-4 h-4 text-bosque" /> {addr.label}
              </h3>

              <div className="text-xs text-tierra space-y-1">
                <p className="font-semibold text-espresso">{addr.name}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state}</p>
                {addr.zipCode && <p className="text-xs">{addr.zipCode}</p>}
                <p className="pt-1">Tel: {addr.phone}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-lino/50">
                <button
                  onClick={() => {
                    /* editar dirección */
                  }}
                  className="text-xs text-tierra hover:text-espresso flex items-center gap-1"
                >
                  <Edit className="w-3 h-3" /> Editar
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => {
                      /* eliminar dirección */
                    }}
                    className="text-xs text-alerta-error hover:text-alerta-error-dark flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Add Address Card */}
      <div className="bg-crema-dark rounded-3xl p-6 border border-dashed border-lino flex flex-col items-center justify-center text-center space-y-2 min-h-[180px] sm:min-h-[220px]">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tierra shadow-xs">
          <Plus className="w-5 h-5 text-ocre" />
        </div>
        <Link
          href={`/cuenta/direcciones/nueva`}
          className="font-serif font-bold text-sm text-espresso"
        >
          Agregar Nueva Dirección
        </Link>
        <p className="text-[11px] text-tierra max-w-xs">
          Guarda la oficina o la casa de un ser querido para enviar regalos de café.
        </p>
      </div>
    </div>
  );
}
