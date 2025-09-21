
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

// 런타임에 환경변수를 평가하도록 함수로 변경
function getR2Config() {
  return {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    defaultBucket: process.env.CLOUDFLARE_R2_BUCKET,
    publicBaseUrl: process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL,
  };
}

const defaultBucket = process.env.CLOUDFLARE_R2_BUCKET;
const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;

// 런타임에 평가되도록 getter 함수 사용
export const isR2Configured = () => {
  const config = getR2Config();
  return Boolean(config.accessKeyId && config.secretAccessKey && config.endpoint);
};

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
  const config = getR2Config();

  if (!config.accessKeyId || !config.secretAccessKey || !config.endpoint) {
    throw new Error('Missing Cloudflare R2 configuration.');
  }

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  return cachedClient;
}

const INVALID_FILENAME_CHARS = /[^a-zA-Z0-9._-]/g;

export function sanitizeFileName(filename: string) {
  const trimmed = filename.trim();
  if (!trimmed) {
    return 'file';
  }
  return trimmed.replace(INVALID_FILENAME_CHARS, '-');
}

export function buildR2ObjectUrl(key: string, bucketName: string = defaultBucket || ''): string {
  const normalizedKey = key.startsWith('/') ? key.slice(1) : key;

  // R2 Public 도메인 환경변수 사용
  // 주의: 이 도메인은 환경변수로 관리되어야 함
  const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;

  if (!publicDomain) {
    console.warn('[R2] CLOUDFLARE_R2_PUBLIC_DOMAIN is not set');
    // Fallback to a placeholder (won't work but won't expose the URL)
    return `https://r2-public-domain-not-configured/${normalizedKey}`;
  }

  // Public URL 반환
  return `${publicDomain}/${normalizedKey}`;
}

export async function deleteR2Object(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;

  if (!bucket) {
    throw new Error('R2 bucket not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}
