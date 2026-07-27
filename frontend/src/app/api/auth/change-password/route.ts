import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  const cookieValue = request.cookies.get(sessionOptions.cookieName)?.value;

  if (!cookieValue) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  let session: SessionData;
  try {
    session = await unsealData<SessionData>(cookieValue, {
      password: sessionOptions.password as string,
      ttl: COOKIE_TTL_SECONDS,
    });
  } catch {
    return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });
  }

  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const body = await request.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Current password and new password are required' },
      { status: 400 },
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: 'New password must be at least 8 characters' },
      { status: 400 },
    );
  }

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  const internalToken = process.env.INTERNAL_API_TOKEN;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-User-Id': session.userId,
    'X-Cooperative-Id': session.cooperativeId,
  };

  if (internalToken) {
    headers['X-Internal-Token'] = internalToken;
  }

  try {
    const response = await fetch(
      `${backendUrl}/api/auth/change-password`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 502 },
    );
  }
}
