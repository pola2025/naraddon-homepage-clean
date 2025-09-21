import { NextResponse } from 'next/server';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const adminPassword = process.env.NARADDON_TUBE_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { message: '관리자 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { password } = body ?? {};

    if (!password || password !== adminPassword) {
      return NextResponse.json({
        message: '비밀번호가 올바르지 않습니다.'
      }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[naraddon-tube][verify]', error);
    return NextResponse.json({ message: '비밀번호 확인에 실패했습니다.' }, { status: 500 });
  }
}
