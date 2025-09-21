import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import BusinessVoiceInterviewVideo from '@/models/BusinessVoiceInterviewVideo';

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.replace('/', '').split('?')[0] || null;
    }
    if (parsed.hostname.endsWith('youtube.com')) {
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v');
      }
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      if (pathSegments[0] === 'embed' && pathSegments[1]) {
        return pathSegments[1];
      }
      if (pathSegments[0] === 'shorts' && pathSegments[1]) {
        return pathSegments[1];
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function fetchYouTubeMetadata(videoId: string) {
  try {
    const endpoint = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as {
      title?: string;
      author_name?: string;
      thumbnail_url?: string;
    };
  } catch (error) {
    console.warn('[business-voice-interviews][metadata] failed', error);
    return null;
  }
}
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    const query = BusinessVoiceInterviewVideo.find().sort({ createdAt: -1 });
    if (limit && Number.isFinite(limit)) {
      query.limit(limit);
    }

    const items = await query.lean();

    return NextResponse.json({
      interviews: items.map((item) => ({
        id: item._id.toString(),
        title: item.title,
        youtubeUrl: item.youtubeUrl,
        videoId: item.videoId,
        channelName: item.channelName,
        thumbnailUrl: item.thumbnailUrl,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error('[business-voice-interviews][GET]', error);
    return NextResponse.json(
      { message: '인터뷰 목록을 가져오는 데 실패했습니다.' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const adminPassword = process.env.BUSINESS_VOICE_INTERVIEW_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ message: '관리자 비밀번호가 설정되지 않았습니다.' }, { status: 500 });
    }

    const body = await request.json();
    const { password, youtubeUrl, action } = body ?? {};

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    if (action === 'verify') {
      return NextResponse.json({ ok: true });
    }

    if (!youtubeUrl || !youtubeUrl.trim()) {
      return NextResponse.json({ message: '유튜브 URL을 입력해주세요.' }, { status: 400 });
    }

    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ message: '유효한 유튜브 URL이 아닙니다.' }, { status: 400 });
    }

    await connectDB();

    const metadata = await fetchYouTubeMetadata(videoId);

    try {
      const created = await BusinessVoiceInterviewVideo.create({
        youtubeUrl: youtubeUrl.trim(),
        videoId,
        title: metadata?.title?.trim() || '제목 없는 인터뷰',
        channelName: metadata?.author_name?.trim() || '',
        thumbnailUrl: metadata?.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      });

      return NextResponse.json(
        {
          interview: {
            id: created._id.toString(),
            title: created.title,
            youtubeUrl: created.youtubeUrl,
            videoId: created.videoId,
            channelName: created.channelName,
            thumbnailUrl: created.thumbnailUrl,
            createdAt: created.createdAt,
          },
        },
        { status: 201 }
      );
    } catch (dbError: unknown) {
      console.error('[business-voice-interviews][POST][create]', dbError);
      return NextResponse.json({ message: '인터뷰를 저장하지 못했습니다.' }, { status: 500 });
    }
  } catch (error) {
    console.error('[business-voice-interviews][POST]', error);
    return NextResponse.json(
      { message: '인터뷰를 등록하지 못했습니다.' },
      { status: 500 }
    );
  }
}





