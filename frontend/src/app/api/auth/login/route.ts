import { NextRequest, NextResponse } from 'next/server';
import { sealData } from 'iron-session';
import { sessionOptions } from '@/lib/session';

const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email e senha são obrigatórios' },
      { status: 400 },
    );
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const backendResponse = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.message || 'Credenciais inválidas' },
        { status: backendResponse.status },
      );
    }

    const data = await backendResponse.json();

    const sessionPayload = {
      userId: data.userId as string,
      cooperativeId: data.cooperativeId as string,
      role: data.role as string,
      name: data.name as string,
      email: data.email as string,
      isLoggedIn: true,
    };

    // Sela os dados diretamente com iron-session
    const sealedSession = await sealData(sessionPayload, {
      password: sessionOptions.password as string,
      ttl: COOKIE_TTL_SECONDS,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        userId: sessionPayload.userId,
        cooperativeId: sessionPayload.cooperativeId,
        role: sessionPayload.role,
        name: sessionPayload.name,
        email: sessionPayload.email,
      },
    });

    // Define o cookie usando a API mais confiável do Next.js
    response.cookies.set(sessionOptions.cookieName, sealedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' &&
        !process.env.NEXT_PUBLIC_APP_URL?.startsWith('http://localhost'),
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 },
    );
  }
}
