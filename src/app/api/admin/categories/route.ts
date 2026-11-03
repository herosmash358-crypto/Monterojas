// API admin de categorías: GET listar, POST crear
import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminCategories,
  createAdminCategory,
} from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getAdminCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('GET /api/admin/categories:', error);
    return NextResponse.json(
      { error: 'No se pudo listar las categorías.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const category = await createAdminCategory({
      name: body.name,
      slug: body.slug,
      description: body.description,
      displayOrder: body.displayOrder,
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/categories:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El slug ya existe.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo crear la categoría.' },
      { status: 500 }
    );
  }
}
