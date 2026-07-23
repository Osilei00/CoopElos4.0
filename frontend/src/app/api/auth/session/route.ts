import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(sessionOptions.cookieName)?.value;

  if (!cookieValue) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const session = await unsealData<SessionData>(cookieValue, {
      password: sessionOptions.password as string,
      ttl: COOKIE_TTL_SECONDS,
    });

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    return NextResponse.json({
      userId: session.userId,
      cooperativeId: session.cooperativeId,
      role: session.role,
      name: session.name,
      email: session.email,
      isLoggedIn: session.isLoggedIn,
    });
  } catch (error) {
    console.error('Session read error:', error);
    return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
  }
}
