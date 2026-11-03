// API de categorías: GET /api/categories
import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/server/catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('GET /api/categories:', error);
    return NextResponse.json(
      { error: 'No se pudo cargar las categorías.' },
      { status: 500 }
    );
  }
}
