import { NextResponse } from 'next/server';

export async function POST() {
  // 임시 응답
  return NextResponse.json({ message: '로그인 기능이 준비 중입니다.' }, { status: 503 });
}
