// API de producto por slug: GET /api/products/:slug
import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { slug: string };
}

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const product = await getProductBySlug(params.slug);
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error('GET /api/products/[slug]:', error);
    return NextResponse.json(
      { error: 'No se pudo cargar el producto.' },
      { status: 500 }
    );
  }
}
