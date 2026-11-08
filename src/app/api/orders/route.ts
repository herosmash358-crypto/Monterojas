// API de órdenes: GET /api/orders (listar) y POST /api/orders (crear)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function generarOrderNumber(): string {
  const now = new Date();
  const fecha = now.toISOString().slice(0, 10).replace(/-/g, '');
  const aleatorio = Math.floor(1000 + Math.random() * 9000);
  return `MR-${fecha}-${aleatorio}`;
}

/** Busca la variante del producto por peso y molienda (fallback solo por peso) */
async function resolverVariantId(productId: string, weightLabel: string, grind: string) {
  const variante = await prisma.productVariant.findFirst({
    where: { productId, weightLabel },
    select: { id: true, weightLabel: true, grind: true, stock: true },
  });
  return variante;
}

interface OrderItemInput {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  variantWeight: string;
  grind: string;
  unitPrice: number;
  quantity: number;
}

interface OrderBody {
  userId?: string;
  orderNumber?: string;
  status?: string;
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  paymentMethod: string;
  paymentStatus?: string;
  trackingNumber?: string;
  notes?: string;
}

/** GET: listar órdenes (opcional ?userId=) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const orders = await prisma.order.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });
    if (orders.length === 0) {
      return NextResponse.json({ orders: [] });
    }

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
    const itemsByOrder = new Map<string, typeof items>();
    for (const item of items) {
      const arr = itemsByOrder.get(item.orderId) ?? [];
      arr.push(item);
      itemsByOrder.set(item.orderId, arr);
    }

    const ordersWithItems = orders.map((orden) => {
      const orderItems = itemsByOrder.get(orden.id) ?? [];
      return {
        ...orden,
        items: orderItems.map((item) => {
          const variant = variantById.get(item.variantId);
          return {
            ...item,
            weightLabel: variant?.weightLabel ?? '',
            grind: variant?.grind ?? item.grind,
          };
        }),
      };
    });

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error('GET /api/orders:', error);
    return NextResponse.json({ error: 'No se pudo listar las órdenes.' }, { status: 500 });
  }
}

/** POST: crear orden desde el carrito (transacción: valida y descuenta stock) */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OrderBody;

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
    }

    // Resolver userId: invitado si no se provee o no existe
    let userId: string | null = null;
    if (body.userId) {
      const existe = await prisma.user.findUnique({ where: { id: body.userId } });
      if (existe) userId = body.userId;
    }

    const orderNumber = body.orderNumber || generarOrderNumber();

    // Validar stock de cada variante y preparar OrderItems
    const itemsParaCrear: Array<{
      variantId: string;
      productName: string;
      productSlug: string;
      weight: number;
      grind: string;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const item of body.items) {
      const variante = await resolverVariantId(
        item.productId,
        item.variantWeight,
        item.grind
      );
      if (!variante) {
        return NextResponse.json(
          { error: `Variante no encontrada para ${item.name} (${item.variantWeight}).` },
          { status: 400 }
        );
      }
      if ((variante.stock ?? 0) < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${item.name} (${item.variantWeight}). Disponible: ${variante.stock}.` },
          { status: 400 }
        );
      }

      itemsParaCrear.push({
        variantId: variante.id,
        productName: item.name,
        productSlug: item.productSlug,
        weight: Number(item.variantWeight.replace(/[^0-9]/g, '')) || 0,
        grind: item.grind,
        quantity: item.quantity,
        unitPrice: Math.round(item.unitPrice),
      });
    }

    // Transacción: descontar stock + crear orden + ítems
    const orden = await prisma.$transaction(async (tx) => {
      // Descontar stock de cada variante
      for (const item of itemsParaCrear) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Crear la orden (sin items anidados)
      const ordenCreada = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: body.status ?? 'pendiente',
          subtotal: Math.round(body.subtotal),
          shipping: Math.round(body.shipping),
          discount: Math.round(body.discount),
          total: Math.round(body.total),
          couponCode: body.couponCode ?? null,
          shippingName: body.shippingName,
          shippingEmail: body.shippingEmail,
          shippingPhone: body.shippingPhone,
          shippingAddress: body.shippingAddress,
          shippingCity: body.shippingCity,
          shippingState: body.shippingState,
          shippingZip: body.shippingZip,
          paymentMethod: body.paymentMethod,
          paymentStatus: body.paymentStatus ?? 'pendiente',
          trackingNumber: body.trackingNumber ?? null,
          notes: body.notes ?? null,
        },
      });

      // Crear los ítems como documentos separados con orderId
      for (const item of itemsParaCrear) {
        await tx.orderItem.create({
          data: {
            orderId: ordenCreada.id,
            variantId: item.variantId,
            productName: item.productName,
            productSlug: item.productSlug,
            weight: item.weight,
            grind: item.grind,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          },
        });
      }

      return ordenCreada;
    });

    return NextResponse.json({ order: orden }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders:', error);
    return NextResponse.json({ error: 'No se pudo crear la orden.' }, { status: 500 });
  }
}
