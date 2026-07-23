export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { unsealData } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

// Rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout', '/api/auth/session'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar rotas de API — elas têm sua própria lógica de autenticação
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Ler e verificar o cookie de sessão
  const cookieValue = request.cookies.get(sessionOptions.cookieName)?.value;

  if (!cookieValue) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const session = await unsealData<SessionData>(cookieValue, {
      password: sessionOptions.password as string,
      ttl: COOKIE_TTL_SECONDS,
    });

    if (!session.isLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    // Cookie inválido/expirado
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
