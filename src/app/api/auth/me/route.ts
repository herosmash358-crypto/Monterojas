// API de sesión actual: GET /api/auth/me
// Devuelve el usuario autenticado basado en la cookie de sesión.
// Usado por las páginas del panel admin para verificar el rol.
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('monterojas_auth')?.value;
    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        flavorPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const flavorPrefs = user.flavorPreferences
      ? JSON.parse(user.flavorPreferences)
      : [];

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        flavorPreferences: flavorPrefs,
      },
    });
  } catch (error) {
    console.error('GET /api/auth/me:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener la sesión.' },
      { status: 500 }
    );
  }
}
