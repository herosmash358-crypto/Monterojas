// API admin de orden individual: PATCH actualizar estado
import { NextRequest, NextResponse } from 'next/server';
import { updateAdminOrderStatus } from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { id: string };
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
