import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getServerAddresses } from '@/lib/server/addresses';
import AddressesList from '@/components/cuenta/AddressesList';

const DEFAULT_USER_ID = 'usr-carlos-1'; // Usuario de prueba del seed (se conecta con auth real en Fase 6)

export default async function AddressesPage() {
  const addresses = await getServerAddresses(DEFAULT_USER_ID);

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

      <AddressesList addresses={addresses} userId={DEFAULT_USER_ID} />
    </div>
  );
}
