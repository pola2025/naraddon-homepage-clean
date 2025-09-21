import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getR2Client, sanitizeFileName, buildR2ObjectUrl, isR2Configured } from '@/lib/r2';
import { v4 as uuidv4 } from 'uuid';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

const ADMIN_PASSWORD = process.env.BUSINESS_VOICE_INTERVIEW_PASSWORD || 'vhffkvhffk82';
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET || 'naraddon-assets';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// POST: Presigned URL 생성 (썸네일 업로드용)
export async function POST(request: NextRequest) {
  // R2 설정 확인
  if (!isR2Configured()) {
    return NextResponse.json(
      { success: false, message: 'R2 storage is not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { password, fileName, contentType } = body;

    // 비밀번호 확인
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 파일 타입 검증
    if (!contentType || !ALLOWED_IMAGE_TYPES.includes(contentType)) {
      return NextResponse.json(
        { success: false, message: '지원하지 않는 파일 형식입니다.' },
        { status: 400 }
      );
    }

    // 파일명 생성
    const sanitizedName = sanitizeFileName(fileName || 'thumbnail');
    const extension = sanitizedName.split('.').pop() || 'jpg';
    const uniqueFileName = `business-voice/interview-thumbnails/${uuidv4()}.${extension}`;

    // Presigned URL 생성
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: contentType,
    });

    const client = getR2Client();
    const presignedUrl = await getSignedUrl(client, command, {
      expiresIn: 3600, // 1시간
    });

    // 공개 URL 생성
    const publicUrl = buildR2ObjectUrl(uniqueFileName, BUCKET_NAME);

    return NextResponse.json({
      success: true,
      uploadUrl: presignedUrl,
      publicUrl,
      objectKey: uniqueFileName,
    });
  } catch (error) {
    console.error('[interview-videos/upload] error:', error);
    return NextResponse.json(
      { success: false, message: '업로드 URL 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}