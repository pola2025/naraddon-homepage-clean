import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting 설정
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // 분당 요청 수
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분

// 에러 로깅 함수
function logError(error: Error, request: NextRequest) {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    url: request.url,
    method: request.method,
    ip: request.ip || 'unknown',
    userAgent: request.headers.get('user-agent'),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
  };

  // 프로덕션에서는 외부 로깅 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // Sentry, DataDog, CloudWatch 등으로 전송
    console.error('[ERROR]', JSON.stringify(errorLog));
  } else {
    console.error('[DEV ERROR]', errorLog);
  }
}

// Rate limiting 체크
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

// 보안 헤더 추가
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

// 성능 모니터링
function trackPerformance(request: NextRequest, startTime: number) {
  const duration = Date.now() - startTime;
  const performanceData = {
    url: request.nextUrl.pathname,
    method: request.method,
    duration,
    timestamp: new Date().toISOString(),
  };

  // 느린 요청 감지 (3초 이상)
  if (duration > 3000) {
    console.warn('[SLOW REQUEST]', performanceData);
  }

  // 메트릭 수집 (프로덕션에서는 외부 서비스로 전송)
  if (process.env.NODE_ENV === 'production') {
    // CloudWatch, DataDog 등으로 전송
  }
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Rate Limiting 체크
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': String(RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
        },
      });
    }

    // 2. CORS 처리
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

    // Preflight 요청 처리
    if (request.method === 'OPTIONS') {
      if (origin && allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        });
      }
    }

    // 3. 요청 유효성 검증
    const contentType = request.headers.get('content-type');
    if (request.method === 'POST' || request.method === 'PUT') {
      if (
        !contentType?.includes('application/json') &&
        !contentType?.includes('multipart/form-data')
      ) {
        return new NextResponse('Unsupported Media Type', { status: 415 });
      }
    }

    // 4. 경로별 인증 체크
    const protectedPaths = ['/api/admin', '/api/user', '/dashboard', '/admin', '/examiner'];
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath) {
      const token =
        request.cookies.get('auth-token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

      if (!token) {
        // API 경로는 401 반환, 페이지는 로그인으로 리다이렉트
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return new NextResponse('Unauthorized', { status: 401 });
        }
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      // JWT 검증 (실제 구현 시 jose 라이브러리 사용)
      // const isValidToken = await verifyJWT(token);
      // if (!isValidToken) {
      //   return NextResponse.redirect(new URL('/auth/login', request.url));
      // }
    }

    // 5. 응답 생성 및 보안 헤더 추가
    let response = NextResponse.next();
    response = addSecurityHeaders(response);

    // CORS 헤더 추가
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    // 6. 성능 모니터링
    trackPerformance(request, startTime);

    return response;
  } catch (error) {
    // 에러 로깅
    logError(error as Error, request);

    // 사용자에게는 일반적인 에러 메시지 반환
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        message:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'An error occurred processing your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
