import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware de protección de rutas del panel de administración.
 *
 * Las rutas bajo /admin requieren autenticación y rol ADMIN.
 * Se verifica la existencia de la cookie de sesión 'monterojas_auth'
 * (establecida tras un login exitoso). La verificación detallada del
 * rol se realiza en cada página/API del admin al consultar la base de datos.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas del panel de administración
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('monterojas_auth');
    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}
