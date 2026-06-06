import { NextRequest, NextResponse } from 'next/server';

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
    // Call backend to validate credentials
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Credenciais inválidas' },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Create session data
    const session = {
      userId: data.userId,
      cooperativeId: data.cooperativeId,
      role: data.role,
      isLoggedIn: true,
    };

    // Create response
    const responseNext = NextResponse.json({
      success: true,
      user: {
        userId: data.userId,
        cooperativeId: data.cooperativeId,
        role: data.role,
      },
    });

    // Set httpOnly cookie with session data
    responseNext.cookies.set('coopelos-session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return responseNext;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 },
    );
  }
}
