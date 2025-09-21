const { S3Client, PutBucketAclCommand, GetBucketAclCommand } = require('@aws-sdk/client-s3');
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

async function enablePublicAccess() {
  try {
    console.log('🔧 R2 버킷 Public Access 설정 중...');
    console.log(`   버킷: ${bucketName}`);

    // Public read access 설정
    const putAclCommand = new PutBucketAclCommand({
      Bucket: bucketName,
      ACL: 'public-read'
    });

    await client.send(putAclCommand);
    console.log('✅ Public Access가 활성화되었습니다!');

    // ACL 확인
    const getAclCommand = new GetBucketAclCommand({
      Bucket: bucketName
    });

    const aclResponse = await client.send(getAclCommand);
    console.log('📋 현재 ACL 설정:', aclResponse);

    console.log('\n🌐 Public URL 형식:');
    console.log(`   https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev/{object-key}`);
    console.log('\n✅ 이제 썸네일에 직접 접근할 수 있습니다!');

  } catch (error) {
    console.error('❌ Public Access 설정 중 오류 발생:', error);

    // Cloudflare API를 사용한 대체 방법 안내
    console.log('\n💡 대체 방법: Cloudflare API 사용');
    console.log('   R2 버킷의 Public Access는 Cloudflare Dashboard에서 수동으로 설정해야 할 수 있습니다.');
    console.log('   1. https://dash.cloudflare.com 접속');
    console.log('   2. R2 > naraddon-assets 버킷 선택');
    console.log('   3. Settings > Public Access > Allow public access 활성화');

    process.exit(1);
  }
}

enablePublicAccess();