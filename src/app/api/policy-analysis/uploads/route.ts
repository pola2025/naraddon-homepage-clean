

import { NextRequest, NextResponse } from 'next/server';

import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import crypto from 'crypto';

import { getR2Client, sanitizeFileName, buildR2ObjectUrl, isR2Configured } from '@/lib/r2';

import { getAdminPasswordOrThrow, hasValidAccess } from '@/app/api/policy-analysis/_access';



const BUCKET = process.env.CLOUDFLARE_R2_BUCKET;

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB

const CACHE_CONTROL_IMMUTABLE = 'public, max-age=31536000, immutable';






function createAttachmentKey(fileName: string) {

  const now = new Date();

  const year = now.getUTCFullYear();

  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  const baseName = sanitizeFileName(fileName);

  const extensionIndex = baseName.lastIndexOf('.');

  const extension = extensionIndex !== -1 ? baseName.slice(extensionIndex) : '';

  const randomId = crypto.randomUUID();

  return `policy-analysis/${year}/${month}/${randomId}${extension}`;

}



export async function POST(request: NextRequest) {

  try {

    if (!isR2Configured()) {
      return NextResponse.json(
        { success: false, message: 'R2 storage is not configured' },
        { status: 503 }
      );
    }

    let adminPassword: string;

    try {

      adminPassword = getAdminPasswordOrThrow();

    } catch (error) {

      console.error('[policy-analysis][UPLOAD][missing password]', error);

      return NextResponse.json(

        { message: '정책분석 글 비밀번호가 설정되어 있지 않습니다.' },

        { status: 500 }

      );

    }



    const formData = await request.formData();

    const password = formData.get('password');

    const uploader = formData.get('uploader');

    const sourceUrl = formData.get('sourceUrl');

    const file = formData.get('file');



    const trimmedPassword = typeof password === 'string' ? password.trim() : undefined;

    if (trimmedPassword && trimmedPassword !== adminPassword) {

      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });

    }



    if (!hasValidAccess(request, trimmedPassword)) {

      return NextResponse.json({ message: '비밀번호 검증이 필요합니다.' }, { status: 401 });

    }



    if (!(file instanceof File)) {

      return NextResponse.json({ message: '업로드할 파일을 선택해주세요.' }, { status: 400 });

    }



    if (file.size === 0) {

      return NextResponse.json({ message: '비어 있는 파일은 업로드할 수 없습니다.' }, { status: 400 });

    }



    if (file.size > MAX_UPLOAD_SIZE) {

      return NextResponse.json({ message: '파일 크기는 최대 5MB까지만 업로드할 수 있습니다.' }, { status: 413 });

    }



    if (!BUCKET) {
      return NextResponse.json({ message: 'Cloudflare R2 bucket is not configured.' }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const checksum = crypto.createHash('sha256').update(buffer).digest('hex');
    const key = createAttachmentKey(file.name);
    const cdnUrl = buildR2ObjectUrl(key, BUCKET);
    const normalizedSourceUrl = typeof sourceUrl === 'string' ? sourceUrl.trim() : '';
    const normalizedUploader =
      typeof uploader === 'string' && uploader.trim() ? uploader.trim() : 'admin';

    const client = getR2Client();
    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentLength: file.size,
        ContentType: file.type || 'application/octet-stream',
        CacheControl: CACHE_CONTROL_IMMUTABLE,
        Metadata: {
          'original-name': file.name,
          checksum,
          'cdn-url': cdnUrl,
        },
      })
    );

    const uploadedAt = new Date();

    return NextResponse.json(
      {
        attachment: {
          key,
          fileName: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          sourceUrl: normalizedSourceUrl,
          cdnUrl,
          checksum,
          uploadedBy: normalizedUploader,
          uploadedAt: uploadedAt.toISOString(),
        },
      },
      { status: 201 }
    );

  } catch (error) {

    console.error('[policy-analysis][UPLOAD][POST]', error);

    return NextResponse.json(

      { message: '파일 업로드 중 오류가 발생했습니다.' },

      { status: 500 }

    );

  }

}



export async function DELETE(request: NextRequest) {

  try {

    if (!isR2Configured()) {
      return NextResponse.json(
        { success: false, message: 'R2 storage is not configured' },
        { status: 503 }
      );
    }

    let adminPassword: string;

    try {

      adminPassword = getAdminPasswordOrThrow();

    } catch (error) {

      console.error('[policy-analysis][UPLOAD][missing password]', error);

      return NextResponse.json(

        { message: '정책분석 글 비밀번호가 설정되어 있지 않습니다.' },

        { status: 500 }

      );

    }



    const body = (await request.json()) as { key?: string; password?: string | null };

    const { key, password } = body;

    const trimmedPassword = password?.trim() || undefined;



    if (!key) {

      return NextResponse.json({ message: '삭제할 파일 키가 필요합니다.' }, { status: 400 });

    }



    if (trimmedPassword && trimmedPassword !== adminPassword) {

      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });

    }



    if (!hasValidAccess(request, trimmedPassword)) {

      return NextResponse.json({ message: '비밀번호 검증이 필요합니다.' }, { status: 401 });

    }



    if (!BUCKET) {
      return NextResponse.json({ message: 'Cloudflare R2 bucket is not configured.' }, { status: 500 });
    }

    const client = getR2Client();
    await client.send(

      new DeleteObjectCommand({

        Bucket: BUCKET,

        Key: key,

      })

    );



    return NextResponse.json({ ok: true });

  } catch (error) {

    console.error('[policy-analysis][UPLOAD][DELETE]', error);

    return NextResponse.json(

      { message: '파일 삭제 중 오류가 발생했습니다.' },

      { status: 500 }

    );

  }

}

