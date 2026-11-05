// API admin de usuarios: GET listar, PATCH actualizar rol
import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminUsers,
  updateAdminUserRole,
} from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { id: string };
}

export async function GET() {
  try {
    const users = await getAdminUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'No se pudo listar los usuarios.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const body = await request.json();

    const user = await updateAdminUserRole(params.id, body.role);

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('PATCH /api/admin/users/[id]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Usuario no encontrado.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo actualizar el usuario.' },
      { status: 500 }
    );
  }
}
