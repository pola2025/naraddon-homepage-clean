import { NextResponse } from 'next/server';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

const getAdminPassword = () => process.env.EXPERT_SERVICES_ADMIN_PASSWORD ?? '';

export async function POST(request: Request) {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) {
      return NextResponse.json(
        { message: 'Admin password is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body as { password?: string };

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: 'The password is incorrect.' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[expert-services/examiners/verify][POST]', error);
    return NextResponse.json({ message: 'Failed to verify the password.' }, { status: 500 });
  }
}
