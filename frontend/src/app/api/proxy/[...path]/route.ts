import { NextRequest, NextResponse } from 'next/server';
import { unsealData } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return proxyRequest(request, path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string,
) {
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

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const backendPath = searchParams
    ? `${backendUrl}/api/${path}?${searchParams}`
    : `${backendUrl}/api/${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-User-Id': session.userId,
    'X-Cooperative-Id': session.cooperativeId,
  };

  const acceptHeader = request.headers.get('accept');
  if (acceptHeader) {
    headers['Accept'] = acceptHeader;
  }

  try {
    const fetchOptions: RequestInit = { method, headers };

    if (method !== 'GET' && method !== 'HEAD') {
      const body = await request.text();
      if (body) fetchOptions.body = body;
    }

    const response = await fetch(backendPath, fetchOptions);
    const contentType = response.headers.get('Content-Type') || 'application/json';

    if (contentType.includes('application/pdf') || contentType.includes('image/')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: response.status,
        headers: { 'Content-Type': contentType },
      });
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor backend' },
      { status: 502 },
    );
  }
}
