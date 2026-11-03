// =============================================================================
// Monterojas - Capa de datos de direcciones (server-only)
// =============================================================================

import { prisma } from '@/lib/prisma';

export interface AddressUI {
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

/** Obtener direcciones de un usuario */
export async function getServerAddresses(userId: string): Promise<AddressUI[]> {
  const rows = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    name: row.name,
    phone: row.phone,
    street: row.street,
    city: row.city,
    state: row.state,
    zipCode: row.zipCode,
    isDefault: row.isDefault,
    createdAt: row.createdAt.toISOString(),
  }));
}
