// 스테이징 환경 썸네일 업로드 테스트
const fs = require('fs');
const path = require('path');

// 테스트 이미지 생성 (1x1 픽셀 PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const testImageBuffer = Buffer.from(testImageBase64, 'base64');
const testImagePath = path.join(__dirname, 'test-staging-image.png');

// 테스트 이미지 파일 생성
fs.writeFileSync(testImagePath, testImageBuffer);

async function testStagingUpload() {
  // 최신 배포 URL 사용
  const STAGING_URL = 'https://homepage-a66zjkc0n-mkt9834-4301s-projects.vercel.app';
  const API_URL = `${STAGING_URL}/api/naraddon-tube/assets/presign`;
  const PASSWORD = 'vhffkvhffk82';

  console.log('=== 스테이징 환경 썸네일 업로드 테스트 ===');
  console.log('Staging URL:', STAGING_URL);
  console.log('API URL:', API_URL);
  console.log('');

  try {
    // 1. Presigned URL 요청
    console.log('1. Presigned URL 요청 중...');
    const presignResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: PASSWORD,
        fileName: 'test-staging-image.png',
        contentType: 'image/png',
      }),
    });

    console.log('   응답 상태:', presignResponse.status, presignResponse.statusText);

    if (!presignResponse.ok) {
      const errorText = await presignResponse.text();
      console.error('   오류 응답:', errorText);

      // JSON 파싱 시도
      try {
        const errorJson = JSON.parse(errorText);
        console.error('   오류 메시지:', errorJson.message);
      } catch (e) {
        // JSON이 아닌 경우 그대로 출력
      }
      return;
    }

    const presignData = await presignResponse.json();
    console.log('   ✅ Presigned URL 생성 성공!');
    console.log('   - Object Key:', presignData.objectKey);
    console.log('   - Public URL:', presignData.publicUrl);

    if (!presignData.uploadUrl) {
      console.error('   ❌ Upload URL이 없습니다.');
      return;
    }

    // 2. 실제 파일 업로드
    console.log('\n2. 파일 업로드 시도 중...');
    const fileBuffer = fs.readFileSync(testImagePath);

    const uploadResponse = await fetch(presignData.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/png',
      },
      body: fileBuffer,
    });

    console.log('   업로드 응답 상태:', uploadResponse.status, uploadResponse.statusText);

    if (uploadResponse.ok) {
      console.log('   ✅ 업로드 성공!');
      console.log('   Public URL:', presignData.publicUrl);

      // 3. 업로드된 파일 확인
      console.log('\n3. Public URL 접근 테스트...');
      const checkResponse = await fetch(presignData.publicUrl, {
        method: 'HEAD'  // HEAD 요청으로 파일 존재 여부만 확인
      });
      console.log('   파일 접근 상태:', checkResponse.status);

      if (checkResponse.ok) {
        console.log('   ✅ 파일이 정상적으로 업로드되었고 접근 가능합니다!');
        console.log('\n📌 테스트 성공!');
        console.log('   이미지 URL:', presignData.publicUrl);
        console.log('   브라우저에서 위 URL을 열어 이미지를 확인할 수 있습니다.');
      } else if (checkResponse.status === 404) {
        console.log('   ⚠️ 파일이 아직 준비되지 않았습니다. (404)');
        console.log('   R2 Public Access 설정이 필요할 수 있습니다.');
      } else {
        console.log('   ⚠️ 파일 접근 제한 (Status:', checkResponse.status + ')');
        console.log('   R2 버킷의 Public Access 설정을 확인하세요.');
      }
    } else {
      const errorText = await uploadResponse.text();
      console.error('   ❌ 업로드 실패:', errorText);
    }

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    if (error.cause) {
      console.error('   원인:', error.cause);
    }
  } finally {
    // 테스트 이미지 삭제
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('\n테스트 이미지 파일 삭제 완료');
    }
  }

  console.log('\n=== 테스트 종료 ===');
}

// 환경 확인
console.log('📋 환경 정보');
console.log('- Node.js 버전:', process.version);
console.log('- 작업 디렉토리:', process.cwd());
console.log('');

// 테스트 실행
testStagingUpload();