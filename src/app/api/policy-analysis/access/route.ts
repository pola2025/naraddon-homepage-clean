import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

const ACCESS_COOKIE = 'policy-analysis-access';
const ACCESS_COOKIE_MAX_AGE = 60 * 30; // 30분

const buildCookieValue = (password: string) =>
  crypto.createHash('sha256').update(password).digest('hex');

export async function GET(request: NextRequest) {
  const adminPassword = process.env.POLICY_ANALYSIS_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { authorized: false, message: '정책분석 작성 비밀번호가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const expected = buildCookieValue(adminPassword);
  const cookie = request.cookies.get(ACCESS_COOKIE);

  return NextResponse.json({ authorized: cookie?.value === expected });
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.POLICY_ANALYSIS_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { message: '정책분석 작성 비밀번호가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({})) as { password?: string };
  const password = body.password?.trim();

  if (!password) {
    return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
  }

  const cookieValue = buildCookieValue(adminPassword);
  const response = NextResponse.json({ authorized: true });
  response.cookies.set({
    name: ACCESS_COOKIE,
    value: cookieValue,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ACCESS_COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}
