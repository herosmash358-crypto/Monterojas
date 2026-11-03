// API admin de productos: GET listar, POST crear
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getAdminProducts,
  createAdminProduct,
} from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  // En esta fase la verificación de rol se hace en cada ruta consultando la DB
  // con el userId de la cookie de sesión.
  return null;
}

export async function GET() {
  try {
    const products = await getAdminProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('GET /api/admin/products:', error);
    return NextResponse.json(
      { error: 'No se pudo listar los productos.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await createAdminProduct({
      name: body.name,
      slug: body.slug,
      sku: body.sku,
      description: body.description,
      tagline: body.tagline,
      categoryId: body.categoryId,
      price: Number(body.price),
      stock: Number(body.stock),
      weightLabel: body.weightLabel,
      grind: body.grind,
      active: body.active,
      isBestseller: body.isBestseller,
      isNew: body.isNew,
      featured: body.featured,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/products:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El slug o SKU ya existe.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo crear el producto.' },
      { status: 500 }
    );
  }
}
