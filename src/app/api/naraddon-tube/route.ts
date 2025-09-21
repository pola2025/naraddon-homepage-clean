import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import NaraddonTubeEntry from '@/models/NaraddonTubeEntry';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

const DEFAULT_SORT = { sortOrder: 1, createdAt: -1 } as const;

type IncomingVideoPayload = {
  title?: string;
  youtubeUrl?: string;
  url?: string;
  youtubeId?: string;
  customThumbnail?: string;
};

type NaraddonTubePayload = {
  password?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl?: string;
  videos?: IncomingVideoPayload[];
  isPublished?: boolean;
  sortOrder?: number;
};

const extractYoutubeId = (value: string) => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname === 'youtu.be') {
      const candidate = url.pathname.replace('/', '').trim();
      return /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
    }

    if (url.hostname.includes('youtube.com')) {
      if (url.searchParams.has('v')) {
        const candidate = url.searchParams.get('v')?.trim();
        return candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
      }

      const segments = url.pathname.split('/').filter(Boolean);
      if (segments[0] === 'embed' && segments[1]) {
        const candidate = segments[1].trim();
        return /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
      }
    }
  } catch (error) {
    // invalid URL -> fallthrough
  }

  return null;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const includeDraft = searchParams.get('includeDraft') === 'true';

    const query = includeDraft ? {} : { isPublished: true };
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    const entriesQuery = NaraddonTubeEntry.find(query).sort(DEFAULT_SORT).lean();
    if (limit && !Number.isNaN(limit)) {
      entriesQuery.limit(limit);
    }

    const entries = await entriesQuery;

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('[naraddon-tube][GET]', error);
    return NextResponse.json({ message: '영상 목록을 불러오지 못했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = process.env.NARADDON_TUBE_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { message: '관리자 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const body = (await request.json()) as NaraddonTubePayload;
    const { password, title, subtitle, description, thumbnailUrl, videos, isPublished, sortOrder } =
      body;

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ message: '제목을 입력해주세요.' }, { status: 400 });
    }

    if (!thumbnailUrl || !thumbnailUrl.trim()) {
      return NextResponse.json({ message: '썸네일 URL을 입력해주세요.' }, { status: 400 });
    }

    // 영상은 선택적 - 없어도 등록 가능
    const normalizedVideos = Array.isArray(videos)
      ? videos.filter(video => {
          const incomingLink =
            (typeof video?.youtubeUrl === 'string' && video.youtubeUrl.trim()) ||
            (typeof video?.url === 'string' && video.url.trim()) ||
            (typeof video?.youtubeId === 'string' && video.youtubeId.trim()) ||
            '';
          return incomingLink !== '';
        }).map((video, index) => {
          const videoTitle =
            typeof video?.title === 'string' && video.title.trim()
              ? video.title.trim()
              : `영상 ${index + 1}`;

          const incomingLink =
            (typeof video?.youtubeUrl === 'string' && video.youtubeUrl.trim()) ||
            (typeof video?.url === 'string' && video.url.trim()) ||
            (typeof video?.youtubeId === 'string' && video.youtubeId.trim()) ||
            '';

          const youtubeId = extractYoutubeId(incomingLink);
          if (!youtubeId) {
            throw new Error(`영상 ${index + 1}의 링크가 올바르지 않습니다.`);
          }

          const normalizedUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

          return {
            title: videoTitle,
            youtubeId,
            url: normalizedUrl,
        customThumbnail:
          typeof video?.customThumbnail === 'string' && video.customThumbnail.trim()
            ? video.customThumbnail.trim()
            : undefined,
          };
        })
      : [];

    await connectDB();

    const entry = await NaraddonTubeEntry.create({
      title: title.trim(),
      subtitle: typeof subtitle === 'string' ? subtitle.trim() : undefined,
      description: typeof description === 'string' ? description.trim() : undefined,
      thumbnailUrl: thumbnailUrl.trim(),
      videos: normalizedVideos,
      isPublished: typeof isPublished === 'boolean' ? isPublished : true,
      sortOrder: typeof sortOrder === 'number' && Number.isFinite(sortOrder) ? sortOrder : 0,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('영상 링크가 올바르지 않습니다.')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error('[naraddon-tube][POST]', error);
    return NextResponse.json({ message: '영상 정보를 저장하지 못했습니다.' }, { status: 500 });
  }
}
