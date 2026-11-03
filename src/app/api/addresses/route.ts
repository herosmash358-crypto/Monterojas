// API de direcciones: GET /api/addresses?userId=  y  POST /api/addresses
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface AddressBody {
  userId: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

/** GET: listar direcciones de un usuario */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId es obligatorio.' }, { status: 400 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('GET /api/addresses:', error);
    return NextResponse.json(
      { error: 'No se pudo listar las direcciones.' },
      { status: 500 }
    );
  }
}

/** POST: crear una dirección */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AddressBody;

    if (!body.userId || !body.label || !body.name || !body.street || !body.city) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios.' },
        { status: 400 }
      );
    }

    // Si se marca como predeterminada, quitar esa marca a las demás del usuario
    if (body.isDefault) {
      await prisma.address.updateMany({
        where: { userId: body.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: body.userId,
        label: body.label,
        name: body.name,
        phone: body.phone,
        street: body.street,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode ?? '',
        isDefault: body.isDefault ?? false,
      },
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error('POST /api/addresses:', error);
    return NextResponse.json(
      { error: 'No se pudo crear la dirección.' },
      { status: 500 }
    );
  }
}
