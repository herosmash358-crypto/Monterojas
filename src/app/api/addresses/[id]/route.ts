// API de dirección individual: PATCH /api/addresses/[id]  y  DELETE /api/addresses/[id]
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { id: string };
}

interface AddressUpdateBody {
  label?: string;
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isDefault?: boolean;
}

/** PATCH: actualizar una dirección */
export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const body = (await request.json()) as AddressUpdateBody;

    // Si se marca como predeterminada, quitar esa marca a las demás del mismo usuario
    if (body.isDefault) {
      const existing = await prisma.address.findUnique({ where: { id: params.id } });
      if (existing) {
        await prisma.address.updateMany({
          where: { userId: existing.userId, isDefault: true },
          data: { isDefault: false },
        });
      }
    }

    const address = await prisma.address.update({
      where: { id: params.id },
      data: {
        ...(body.label !== undefined && { label: body.label }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.street !== undefined && { street: body.street }),
        ...(body.city !== undefined && { city: body.city }),
        ...(body.state !== undefined && { state: body.state }),
        ...(body.zipCode !== undefined && { zipCode: body.zipCode }),
        ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
      },
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error('PATCH /api/addresses/[id]:', error);
    return NextResponse.json(
      { error: 'No se pudo actualizar la dirección.' },
      { status: 500 }
    );
  }
}

/** DELETE: eliminar una dirección */
export async function DELETE(_request: NextRequest, { params }: RouteProps) {
  try {
    await prisma.address.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/addresses/[id]:', error);
    return NextResponse.json(
      { error: 'No se pudo eliminar la dirección.' },
      { status: 500 }
    );
  }
}
