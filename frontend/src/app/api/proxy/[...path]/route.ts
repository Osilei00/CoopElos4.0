import { NextRequest, NextResponse } from 'next/server';

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
  // Get session from cookie
  const sessionCookie = request.cookies.get('coopelos-session');

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 },
    );
  }

  let session;
  try {
    session = JSON.parse(sessionCookie.value);
  } catch {
    return NextResponse.json(
      { error: 'Sessão corrompida' },
      { status: 401 },
    );
  }

  if (!session.isLoggedIn) {
    return NextResponse.json(
      { error: 'Sessão inválida' },
      { status: 401 },
    );
  }

  // Build backend URL
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const backendPath = searchParams
    ? `${backendUrl}/api/${path}?${searchParams}`
    : `${backendUrl}/api/${path}`;

  // Forward request to backend with auth headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-User-Id': session.userId,
    'X-Cooperative-Id': session.cooperativeId,
  };

  // Forward any additional headers from the original request
  const acceptHeader = request.headers.get('accept');
  if (acceptHeader) {
    headers['Accept'] = acceptHeader;
  }

  try {
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for non-GET/HEAD requests
    if (method !== 'GET' && method !== 'HEAD') {
      const body = await request.text();
      if (body) {
        fetchOptions.body = body;
      }
    }

    const response = await fetch(backendPath, fetchOptions);

    // Forward response status and headers
    const responseHeaders: Record<string, string> = {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    };

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor backend' },
      { status: 502 },
    );
  }
}
