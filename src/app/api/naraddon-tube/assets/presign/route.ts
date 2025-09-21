import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { buildR2ObjectUrl, getR2Client, sanitizeFileName, isR2Configured } from '@/lib/r2';

const bucketName = process.env.CLOUDFLARE_R2_BUCKET;

export async function POST(request: NextRequest) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        { success: false, message: 'R2 storage is not configured' },
        { status: 503 }
      );
    }

    const adminPassword = process.env.NARADDON_TUBE_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { message: '관리자 비밀번호가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    if (!bucketName) {
      return NextResponse.json(
        { message: 'Cloudflare R2 버킷 설정이 누락되었습니다.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { password, fileName, contentType } = body ?? {};

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ message: '파일 이름이 필요합니다.' }, { status: 400 });
    }

    const safeName = sanitizeFileName(fileName);
    const uniqueId = `${Date.now()}-${randomUUID()}`;
    const objectKey = `naraddon-tube/thumbnails/${uniqueId}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType:
        typeof contentType === 'string' && contentType ? contentType : 'application/octet-stream',
    });

    const client = getR2Client();
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 });
    const publicUrl = buildR2ObjectUrl(objectKey, bucketName);

    return NextResponse.json({ uploadUrl, objectKey, publicUrl });
  } catch (error) {
    console.error('[naraddon-tube][presign]', error);
    return NextResponse.json({ message: '업로드 URL을 생성하지 못했습니다.' }, { status: 500 });
  }
}
