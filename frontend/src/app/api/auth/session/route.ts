import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('coopelos-session');

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 },
    );
  }

  try {
    const session = JSON.parse(sessionCookie.value);

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Sessão inválida' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      userId: session.userId,
      cooperativeId: session.cooperativeId,
      role: session.role,
      isLoggedIn: session.isLoggedIn,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Sessão corrompida' },
      { status: 401 },
    );
  }
}
