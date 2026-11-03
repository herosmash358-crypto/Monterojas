// API de voto útil: PATCH /api/reviews/[id]/helpful
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface RouteProps {
  params: { id: string };
}

export async function PATCH(_request: Request, { params }: RouteProps) {
  try {
    const review = await prisma.review.update({
      where: { id: params.id },
      data: { helpfulCount: { increment: 1 } },
      select: { id: true, helpfulCount: true },
    });
    return NextResponse.json({ review });
  } catch (error) {
    console.error('PATCH /api/reviews/[id]/helpful:', error);
    return NextResponse.json(
      { error: 'No se pudo registrar el voto.' },
      { status: 500 }
    );
  }
}
