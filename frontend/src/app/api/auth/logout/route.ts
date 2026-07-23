import { NextRequest, NextResponse } from 'next/server';
import { sessionOptions } from '@/lib/session';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Apaga o cookie definindo maxAge=0
  response.cookies.set(sessionOptions.cookieName, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' &&
      !process.env.NEXT_PUBLIC_APP_URL?.startsWith('http://localhost'),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
