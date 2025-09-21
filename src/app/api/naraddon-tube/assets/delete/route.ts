import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

import { getR2Client, isR2Configured } from '@/lib/r2';

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
    const { password, objectKey } = body ?? {};

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    if (!objectKey || typeof objectKey !== 'string') {
      return NextResponse.json({ message: '삭제할 대상이 없습니다.' }, { status: 400 });
    }

    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: objectKey });
    const client = getR2Client();
    await client.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[naraddon-tube][delete]', error);
    return NextResponse.json({ message: '썸네일을 삭제하지 못했습니다.' }, { status: 500 });
  }
}
