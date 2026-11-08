// =============================================================================
// Monterojas - Capa de datos de órdenes (server-only)
// Adaptado para MongoDB: sin @relation, variantes se resuelven por variantId
// =============================================================================

import { prisma } from '@/lib/prisma';
import type { OrderItem as OrderItemRow, ProductVariant as ProductVariantRow } from '@prisma/client';

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
    orderBy: { createdAt: 'desc' },
  });
  if (orders.length === 0) return [];

  const orderIds = orders.map((o) => o.id);

  // Items por lote
  const items = await prisma.orderItem.findMany({
    where: { orderId: { in: orderIds } },
  });

  // Variantes por lote (para weightLabel y grind)
  const variantIds = new Set(items.map((i) => i.variantId));
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: Array.from(variantIds) } },
    select: { id: true, weightLabel: true, grind: true },
  });
  const variantById = new Map(variants.map((v) => [v.id, v]));

  // Agrupar items por orden
  const itemsByOrder = new Map<string, OrderItemRow[]>();
  for (const item of items) {
    const arr = itemsByOrder.get(item.orderId) ?? [];
    arr.push(item);
    itemsByOrder.set(item.orderId, arr);
  }

  return orders.map((orden) => {
    const orderItems = itemsByOrder.get(orden.id) ?? [];
    return {
      id: orden.id,
      orderNumber: orden.orderNumber,
      status: orden.status,
      date: formatearFecha(orden.createdAt),
      trackingNumber: orden.trackingNumber ?? null,
      total: orden.total,
      items: orderItems.map((item) => {
        const variant = variantById.get(item.variantId);
        return {
          productId: undefined,
          productSlug: item.productSlug ?? undefined,
          name: item.productName,
          image: undefined,
          weight: String(item.weight),
          grind: variant?.grind ?? item.grind,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        };
      }),
      shippingAddress: {
        fullName: orden.shippingName ?? undefined,
        street: orden.shippingAddress ?? undefined,
        city: orden.shippingCity ?? undefined,
        department: orden.shippingState ?? undefined,
        phone: orden.shippingPhone ?? undefined,
        notes: orden.notes ?? undefined,
      },
    };
  });
}
