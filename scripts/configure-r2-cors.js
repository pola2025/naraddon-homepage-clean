const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error('❌ 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function configureCORS() {
  try {
    const corsConfiguration = {
      CORSRules: [
        {
          AllowedOrigins: [
            'https://naraddon.com',
            'https://www.naraddon.com',
            'http://localhost:3000',
            'http://localhost:3001',
            'https://*.vercel.app'
          ],
          AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag', 'Content-Type', 'x-amz-request-id'],
          MaxAgeSeconds: 3600
        }
      ]
    };

    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: corsConfiguration
    });

    await client.send(command);
    console.log('✅ CORS 설정이 성공적으로 업데이트되었습니다.');
    console.log('📌 설정된 허용 도메인:');
    corsConfiguration.CORSRules[0].AllowedOrigins.forEach(origin => {
      console.log(`   - ${origin}`);
    });
  } catch (error) {
    console.error('❌ CORS 설정 중 오류 발생:', error);
    process.exit(1);
  }
}

configureCORS();