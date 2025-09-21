import { NextRequest, NextResponse } from 'next/server';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

// 관리자 비밀번호 (환경변수 우선 사용)
const ADMIN_PASSWORD = process.env.BUSINESS_VOICE_INTERVIEW_PASSWORD || 'vhffkvhffk82';

// POST: 비밀번호 확인
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '인증되었습니다.',
    });
  } catch (error) {
    console.error('[interview-videos/verify] error:', error);
    return NextResponse.json(
      { success: false, message: '인증 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}