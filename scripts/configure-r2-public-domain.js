const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET;

if (!accountId || !apiToken || !bucketName) {
  console.error('❌ 환경변수가 설정되지 않았습니다.');
  console.error('   필요한 환경변수:');
  console.error('   - CLOUDFLARE_ACCOUNT_ID');
  console.error('   - CLOUDFLARE_API_TOKEN');
  console.error('   - CLOUDFLARE_R2_BUCKET');
  process.exit(1);
}

async function enablePublicDomain() {
  try {
    console.log('🔧 R2 버킷 Public Domain 설정 중...');
    console.log(`   Account ID: ${accountId}`);
    console.log(`   Bucket: ${bucketName}`);

    // R2 버킷의 public domain 활성화
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/public`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enabled: true
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${JSON.stringify(data)}`);
    }

    if (data.success) {
      console.log('✅ Public Domain이 활성화되었습니다!');

      if (data.result && data.result.public_url) {
        console.log(`🌐 Public URL: ${data.result.public_url}`);
        console.log('\n📝 환경변수에 추가하세요:');
        console.log(`CLOUDFLARE_R2_PUBLIC_DOMAIN=${data.result.public_url}`);
      } else {
        console.log('🌐 Public Domain: https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev');
      }

      console.log('\n✅ 이제 썸네일에 직접 접근할 수 있습니다!');
    } else {
      console.error('❌ API 응답이 성공하지 못했습니다:', data);
    }

  } catch (error) {
    console.error('❌ Public Domain 설정 중 오류 발생:', error.message);

    console.log('\n💡 수동 설정 방법:');
    console.log('   1. https://dash.cloudflare.com 접속');
    console.log('   2. R2 > naraddon-assets 버킷 선택');
    console.log('   3. Settings > Public Access');
    console.log('   4. "Allow public access" 활성화');
    console.log('   5. 제공된 Public URL을 환경변수에 설정');

    process.exit(1);
  }
}

enablePublicDomain();