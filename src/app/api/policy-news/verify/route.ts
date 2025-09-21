import { NextResponse } from 'next/server';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.POLICY_NEWS_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ message: '게시글 비밀번호가 설정되지 않았습니다.' }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body as { password?: string };

    if (!password) {
      return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[policy-news][VERIFY]', error);
    return NextResponse.json({ message: '비밀번호 검증에 실패했습니다.' }, { status: 500 });
  }
}
