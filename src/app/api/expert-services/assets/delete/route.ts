import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

import { getR2Client, isR2Configured } from '@/lib/r2';

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
    const { password, objectKey } = body as { password?: string; objectKey?: string };

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: 'The password is incorrect.' }, { status: 401 });
    }

    if (!objectKey || typeof objectKey !== 'string') {
      return NextResponse.json({ message: 'Object key is required.' }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const client = getR2Client();
    await client.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[expert-services/assets/delete][POST]', error);
    return NextResponse.json({ message: 'Failed to delete the uploaded file.' }, { status: 500 });
  }
}
