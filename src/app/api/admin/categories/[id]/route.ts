// API admin de categoría individual: PUT actualizar, DELETE eliminar
import { NextRequest, NextResponse } from 'next/server';
import {
  updateAdminCategory,
  deleteAdminCategory,
} from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteProps) {
  try {
    const body = await request.json();

    const category = await updateAdminCategory(params.id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      displayOrder: body.displayOrder,
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('PUT /api/admin/categories/[id]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada.' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El slug ya existe.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo actualizar la categoría.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteProps) {
  try {
    await deleteAdminCategory(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('DELETE /api/admin/categories/[id]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Categoría no encontrada.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo eliminar la categoría.' },
      { status: 500 }
    );
  }
}
