import { NextResponse } from 'next/server';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

const WRITE_PASSWORD = process.env.TTONTOK_WRITE_PASSWORD || 'vhffkvhffk82';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password || password !== WRITE_PASSWORD) {
    return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
