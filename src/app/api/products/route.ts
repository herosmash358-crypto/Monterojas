// API de productos: GET /api/products?categoria=&subcategoria=
import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getProductsByCategory } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('categoria');
  const subcategory = searchParams.get('subcategoria') ?? undefined;

  try {
    const products =
      category !== null
        ? await getProductsByCategory(category, subcategory)
        : await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('GET /api/products:', error);
    return NextResponse.json(
      { error: 'No se pudo cargar el catálogo de productos.' },
      { status: 500 }
    );
  }
}
