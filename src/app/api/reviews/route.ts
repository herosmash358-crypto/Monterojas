// API de creación de reseñas: POST /api/reviews
// Crea una reseña en la DB. Si no se provee userId válido, usa/crea un
// usuario invitado para no romper la clave foránea.
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const INVITADO_EMAIL = 'invitado@monterojas.example';
const INVITADO_NAME = 'Cliente Invitado';

async function getOrCreateInvitadoUser() {
  let user = await prisma.user.findUnique({ where: { email: INVITADO_EMAIL } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: INVITADO_NAME,
        email: INVITADO_EMAIL,
        password: 'invitado',
        role: 'USER',
      },
    });
  }
  return user.id;
}

interface ReviewBody {
  productId: string;
  userId?: string;
  rating: number;
  title?: string;
  content?: string;
  brewMethod?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReviewBody;

    if (!body.productId || !body.rating) {
      return NextResponse.json(
        { error: 'productId y rating son obligatorios.' },
        { status: 400 }
      );
    }

    // Verificar que el producto exista
    const producto = await prisma.product.findUnique({
      where: { id: body.productId },
      select: { id: true },
    });
    if (!producto) {
      return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
    }

    // Resolver userId: usar el provisto si existe, si no el invitado
    let userId = body.userId;
    if (userId) {
      const existe = await prisma.user.findUnique({ where: { id: userId } });
      if (!existe) userId = undefined;
    }
    if (!userId) {
      userId = await getOrCreateInvitadoUser();
    }

    const review = await prisma.review.create({
      data: {
        productId: body.productId,
        userId,
        rating: Math.max(1, Math.min(5, Math.round(body.rating))),
        title: body.title ?? null,
        content: body.content ?? null,
        brewMethod: body.brewMethod ?? null,
        isVerified: false,
        helpfulCount: 0,
        status: 'approved',
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reviews:', error);
    return NextResponse.json(
      { error: 'No se pudo crear la reseña.' },
      { status: 500 }
    );
  }
}
