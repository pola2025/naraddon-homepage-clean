import { NextRequest, NextResponse } from 'next/server';

import { getBusinessVoiceQuestions } from '@/lib/businessVoiceService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limitParam = searchParams.get('limit');
    const needsExpertParam = searchParams.get('needsExpertReply');

    const limit = limitParam ? Number(limitParam) : undefined;
    const needsExpertReply =
      typeof needsExpertParam === 'string' ? needsExpertParam === 'true' : undefined;

    const questions = await getBusinessVoiceQuestions({
      category,
      limit,
      needsExpertReply,
    });

    return NextResponse.json({ questions, count: questions.length });
  } catch (error) {
    console.error('[business-voice] GET /api/business-voice/questions error', error);
    return NextResponse.json(
      { message: 'Failed to load Business Voice questions.' },
      { status: 500 }
    );
  }
}
