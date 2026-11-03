// API admin de producto individual: PUT actualizar, DELETE eliminar
import { NextRequest, NextResponse } from 'next/server';
import {
  updateAdminProduct,
  deleteAdminProduct,
} from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteProps) {
  try {
    const body = await request.json();

    const product = await updateAdminProduct(params.id, {
      name: body.name,
      slug: body.slug,
      description: body.description,
      tagline: body.tagline,
      categoryId: body.categoryId,
      price: body.price !== undefined ? Number(body.price) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : undefined,
      weightLabel: body.weightLabel,
      grind: body.grind,
      active: body.active,
      isBestseller: body.isBestseller,
      isNew: body.isNew,
      featured: body.featured,
    });

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('PUT /api/admin/products/[id]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado.' },
        { status: 404 }
      );
    }
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El slug o SKU ya existe.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo actualizar el producto.' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteProps) {
  try {
    await deleteAdminProduct(params.id);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('DELETE /api/admin/products/[id]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Producto no encontrado.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo eliminar el producto.' },
      { status: 500 }
    );
  }
}
