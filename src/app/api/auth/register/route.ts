// API de registro: POST /api/auth/register
// Crea un nuevo usuario en la base de datos (texto plano para desarrollo).
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterBody;
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email.' },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: 'Cuenta creada exitosamente.',
    });
  } catch (error) {
    console.error('POST /api/auth/register:', error);
    return NextResponse.json(
      { error: 'No se pudo crear la cuenta.' },
      { status: 500 }
    );
  }
}
