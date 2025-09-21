import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import BusinessVoiceInterviewVideo from '@/models/BusinessVoiceInterviewVideo';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const adminPassword = process.env.BUSINESS_VOICE_INTERVIEW_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { message: '관리자 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: '삭제할 항목을 찾을 수 없습니다.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({ password: undefined }));
    const { password } = body ?? {};

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    await connectDB();

    const deleted = await BusinessVoiceInterviewVideo.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: '이미 삭제되었거나 존재하지 않는 인터뷰입니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[business-voice-interviews][DELETE]', error);
    return NextResponse.json({ message: '인터뷰를 삭제하지 못했습니다.' }, { status: 500 });
  }
}
