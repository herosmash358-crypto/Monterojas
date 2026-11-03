// API admin de órdenes: GET listar, PATCH actualizar estado
import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminOrders,
  updateAdminOrderStatus,
} from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { id: string };
}

export async function GET() {
  try {
    const orders = await getAdminOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('GET /api/admin/orders:', error);
    return NextResponse.json(
      { error: 'No se pudo listar las órdenes.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const body = await request.json();

    const order = await updateAdminOrderStatus(params.id, body.status);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('PATCH /api/admin/orders/[id]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Orden no encontrada.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo actualizar la orden.' },
      { status: 500 }
    );
  }
}
