'use client';

import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import AddressForm from '@/components/cuenta/AddressForm';

const DEFAULT_USER_ID = 'usr-carlos-1'; // Usuario de prueba del seed (se conecta con auth real en Fase 6)

export default function NewAddressPage() {
  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-20">
      <nav className="flex items-center gap-2 text-xs text-tierra">
        <Link href="/cuenta/direcciones" className="hover:text-espresso">
          Direcciones
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="font-bold text-espresso">Nueva Dirección</span>
      </nav>

      <AddressForm userId={DEFAULT_USER_ID} onCancel={() => {}} onSuccess={() => {}} />
    </div>
  );
}
