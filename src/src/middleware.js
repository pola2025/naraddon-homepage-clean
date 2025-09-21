import { NextResponse } from 'next/server';

export function middleware(request) {
  // Basic Authentication
  const authHeader = request.headers.get('authorization');
  const isAuthenticated = checkAuth(authHeader);

  if (!isAuthenticated) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

function checkAuth(authHeader) {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const base64 = authHeader.split(' ')[1];
  const [user, password] = Buffer.from(base64, 'base64').toString().split(':');

  // 여기에 원하는 ID/PW 설정
  return user === 'naraddon' && password === 'demo2024';
}

// 인증이 필요한 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
