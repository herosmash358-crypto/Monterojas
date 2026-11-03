// API de login: POST /api/auth/login
// Valida credenciales contra la base de datos (texto plano para desarrollo;
// en producción usar bcrypt + sesiones/JWT).
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        flavorPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    // Nota: en esta fase la contraseña se compara en texto plano (dev).
    // Fase posterior: agregar bcrypt y sesiones seguras.
    const userRecord = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    });
    if (!userRecord || userRecord.password !== password) {
      return NextResponse.json(
        { error: 'Credenciales inválidas.' },
        { status: 401 }
      );
    }

    const flavorPrefs = user.flavorPreferences
      ? JSON.parse(user.flavorPreferences)
      : [];

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: '',
        city: '',
        department: '',
        favoriteRoast: 'Medio',
        preferredBrewMethod: 'V60 (Hario)',
        flavorPreferences: flavorPrefs,
      },
    });
  } catch (error) {
    console.error('POST /api/auth/login:', error);
    return NextResponse.json(
      { error: 'No se pudo iniciar sesión.' },
      { status: 500 }
    );
  }
}
