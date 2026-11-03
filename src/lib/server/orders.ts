// =============================================================================
// Monterojas - Capa de datos de órdenes (server-only)
// =============================================================================

import { prisma } from '@/lib/prisma';

export interface OrderItemUI {
  productId?: string;
  productSlug?: string;
  name: string;
  image?: string;
  weight: string;
  grind: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderUI {
  id: string;
  orderNumber?: string;
  status: string;
  date: string;
  trackingNumber?: string | null;
  total: number;
  items: OrderItemUI[];
  shippingAddress: {
    fullName?: string;
    street?: string;
    city?: string;
    department?: string;
    phone?: string;
    notes?: string;
  };
}

function formatearFecha(fecha: Date | string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
}

/** Obtener órdenes (todas, o filtradas por usuario si se provee userId) */
export async function getServerOrders(userId?: string): Promise<OrderUI[]> {
  const orders = await prisma.order.findMany({
    where: userId ? { userId } : {},
    include: {
      items: {
        include: { variant: { select: { weightLabel: true, grind: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return orders.map((orden) => ({
    id: orden.id,
    orderNumber: orden.orderNumber,
    status: orden.status,
    date: formatearFecha(orden.createdAt),
    trackingNumber: orden.trackingNumber ?? null,
    total: orden.total,
    items: orden.items.map((item) => ({
      productId: undefined, // OrderItem no guarda productId directo (usa variantId)
      productSlug: item.productSlug ?? undefined,
      name: item.productName,
      image: undefined, // OrderItem no guarda imagen; se muestra placeholder
      weight: String(item.weight),
      grind: item.grind,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
    shippingAddress: {
      fullName: orden.shippingName ?? undefined,
      street: orden.shippingAddress ?? undefined,
      city: orden.shippingCity ?? undefined,
      department: orden.shippingState ?? undefined,
      phone: orden.shippingPhone ?? undefined,
      notes: orden.notes ?? undefined,
    },
  }));
}
