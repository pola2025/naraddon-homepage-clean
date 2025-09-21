import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { buildR2ObjectUrl, getR2Client, sanitizeFileName, isR2Configured } from '@/lib/r2';

const getAdminPassword = () => process.env.EXPERT_SERVICES_ADMIN_PASSWORD ?? '';
const bucketName = process.env.CLOUDFLARE_R2_BUCKET;

export async function POST(request: NextRequest) {
  try {
    if (!isR2Configured()) {
      return NextResponse.json(
        { success: false, message: 'R2 storage is not configured' },
        { status: 503 }
      );
    }

    const adminPassword = getAdminPassword();
    if (!adminPassword) {
      return NextResponse.json(
        { message: 'Admin password is not configured on the server.' },
        { status: 500 }
      );
    }

    if (!bucketName) {
      return NextResponse.json(
        { message: 'Cloudflare R2 bucket is not configured.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password, fileName, contentType } = body as {
      password?: string;
      fileName?: string;
      contentType?: string;
    };

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: 'The password is incorrect.' }, { status: 401 });
    }

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ message: 'File name is required.' }, { status: 400 });
    }

    const safeName = sanitizeFileName(fileName);
    const uniqueId = `${Date.now()}-${randomUUID()}`;
    const objectKey = `expert-services/examiners/${uniqueId}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType:
        contentType && typeof contentType === 'string' && contentType.trim()
          ? contentType
          : 'application/octet-stream',
    });

    const client = getR2Client();
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 });
    const publicUrl = buildR2ObjectUrl(objectKey, bucketName);

    return NextResponse.json({ uploadUrl, objectKey, publicUrl });
  } catch (error) {
    console.error('[expert-services/assets/presign][POST]', error);
    return NextResponse.json({ message: 'Failed to create upload URL.' }, { status: 500 });
  }
}
