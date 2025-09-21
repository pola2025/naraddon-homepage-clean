import { NextResponse } from 'next/server';

export async function GET() {
  // 임시 응답
  return NextResponse.json({ consultations: [] }, { status: 200 });
}

export async function POST() {
  // 임시 응답
  return NextResponse.json({ message: '상담 신청 기능이 준비 중입니다.' }, { status: 503 });
}
