// API admin de estadísticas: GET dashboard
import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/server/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getAdminStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('GET /api/admin/stats:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener las estadísticas.' },
      { status: 500 }
    );
  }
}
