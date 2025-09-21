import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BusinessVoiceInterviewVideo from '@/models/BusinessVoiceInterviewVideo';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

// 관리자 비밀번호 (환경변수 우선 사용)
const ADMIN_PASSWORD = process.env.BUSINESS_VOICE_INTERVIEW_PASSWORD || 'vhffkvhffk82';

// GET: 영상 목록 조회
export async function GET() {
  try {
    await connectDB();

    const videos = await BusinessVoiceInterviewVideo
      .find({ isPublished: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    // YouTube ID 추출 및 썸네일 URL 생성
    const videosWithThumbnails = videos.map(video => {
      const youtubeId = extractYouTubeId(video.youtubeUrl);
      const youtubeThumbnail = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

      return {
        ...video,
        youtubeId,
        displayThumbnail: video.thumbnailUrl || youtubeThumbnail,
        youtubeThumbnail,
      };
    });

    return NextResponse.json({
      success: true,
      videos: videosWithThumbnails
    });
  } catch (error) {
    console.error('[interview-videos] GET error:', error);
    return NextResponse.json(
      { success: false, message: '영상 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 영상 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, youtubeUrl, thumbnailUrl, title, description, author, company, amount } = body;

    // 비밀번호 확인
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 필수 필드 확인
    if (!youtubeUrl || !title) {
      return NextResponse.json(
        { success: false, message: 'YouTube URL과 제목은 필수입니다.' },
        { status: 400 }
      );
    }

    // YouTube URL 유효성 검사
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json(
        { success: false, message: '올바른 YouTube URL이 아닙니다.' },
        { status: 400 }
      );
    }

    await connectDB();

    // 현재 최대 sortOrder 구하기
    const maxSortOrder = await BusinessVoiceInterviewVideo
      .findOne()
      .sort({ sortOrder: -1 })
      .select('sortOrder');

    const newVideo = await BusinessVoiceInterviewVideo.create({
      youtubeUrl,
      thumbnailUrl,
      title,
      description,
      author,
      company,
      amount,
      sortOrder: (maxSortOrder?.sortOrder || 0) + 1,
      isPublished: true,
    });

    return NextResponse.json({
      success: true,
      message: '영상이 성공적으로 등록되었습니다.',
      video: newVideo,
    });
  } catch (error) {
    console.error('[interview-videos] POST error:', error);
    return NextResponse.json(
      { success: false, message: '영상 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// YouTube ID 추출 헬퍼 함수
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}