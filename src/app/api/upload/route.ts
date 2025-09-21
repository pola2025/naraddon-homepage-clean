import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

import { buildR2ObjectUrl, getR2Client, isR2Configured } from '@/lib/r2';

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  if (!isR2Configured() || !BUCKET_NAME) {
    return NextResponse.json(
      { error: 'Cloudflare R2 버킷 설정이 누락되었습니다.' },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 존재하지 않습니다.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. JPG, PNG, WebP, GIF만 허용됩니다.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: '파일 크기가 10MB를 초과합니다.' },
        { status: 400 },
      );
    }

    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `ttontok/${uuidv4()}.${extension}`.toLowerCase();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const s3Client = getR2Client();
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'max-age=31536000',
      Metadata: {
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
      },
    });

    await s3Client.send(uploadCommand);

    const cdnUrl = ACCOUNT_ID
      ? `https://pub-${ACCOUNT_ID}.r2.dev/${fileName}`
      : buildR2ObjectUrl(fileName, BUCKET_NAME);

    return NextResponse.json({
      success: true,
      url: cdnUrl,
      fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('[upload][POST] 이미지 업로드 실패:', error);
    return NextResponse.json(
      { error: '이미지 업로드 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
