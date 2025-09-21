import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { deleteR2Object } from '@/lib/r2';

export const dynamic = 'force-dynamic';

function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();

  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

export async function PUT(request: NextRequest) {
  try {
    const adminPassword = process.env.NARADDON_TUBE_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { message: '관리자 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      password,
      entryId,
      title,
      subtitle,
      description,
      thumbnailUrl,
      oldThumbnailUrl,
      videos,
      sortOrder,
      isPublished
    } = body;

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    if (!entryId) {
      return NextResponse.json(
        { message: '수정할 항목 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        { message: '제목을 입력해 주세요.' },
        { status: 400 }
      );
    }

    if (!thumbnailUrl?.trim()) {
      return NextResponse.json(
        { message: '썸네일 이미지가 필요합니다.' },
        { status: 400 }
      );
    }

    // 영상은 선택적 - 없어도 수정 가능
    const processedVideos = Array.isArray(videos)
      ? videos.filter(video => video?.youtubeUrl?.trim()).map((video, index) => {
          const youtubeId = extractYoutubeId(video.youtubeUrl);
          if (!youtubeId) {
            throw new Error(`영상 ${index + 1}의 YouTube 링크가 올바르지 않습니다.`);
          }
          return {
            title: video.title?.trim() || `영상 ${index + 1}`,
            youtubeId,
            url: `https://www.youtube.com/watch?v=${youtubeId}`,
            customThumbnail: video.customThumbnail?.trim() || null
          };
        })
      : [];

    // 썸네일이 변경된 경우 이전 썸네일 삭제
    if (oldThumbnailUrl &&
        oldThumbnailUrl !== thumbnailUrl &&
        oldThumbnailUrl.includes('r2.cloudflarestorage.com')) {
      try {
        const url = new URL(oldThumbnailUrl);
        const pathParts = url.pathname.split('/');
        const objectKey = pathParts.slice(1).join('/');
        await deleteR2Object(objectKey);
      } catch (error) {
        console.error('[naraddon-tube][update] R2 deletion error:', error);
      }
    }

    const db = await connectDB();
    const collection = db.collection('naraddon-tube');

    const updateData = {
      title: title.trim(),
      subtitle: subtitle?.trim() || '',
      description: description?.trim() || '',
      thumbnailUrl: thumbnailUrl.trim(),
      videos: processedVideos,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isPublished: Boolean(isPublished),
      updatedAt: new Date().toISOString()
    };

    const result = await collection.updateOne(
      { _id: entryId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: '해당 항목을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '항목이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('[naraddon-tube][update]', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : '항목 수정 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}