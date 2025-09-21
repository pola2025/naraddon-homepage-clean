// 썸네일 업로드 테스트 스크립트
const fs = require('fs');
const path = require('path');

// 테스트 이미지 생성 (1x1 픽셀 PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const testImageBuffer = Buffer.from(testImageBase64, 'base64');
const testImagePath = path.join(__dirname, 'test-image.png');

// 테스트 이미지 파일 생성
fs.writeFileSync(testImagePath, testImageBuffer);

async function testThumbnailUpload() {
  const API_URL = 'http://localhost:3000/api/naraddon-tube/assets/presign';
  const PASSWORD = 'vhffkvhffk82';

  console.log('=== 썸네일 업로드 테스트 시작 ===');
  console.log('API URL:', API_URL);
  console.log('테스트 이미지:', testImagePath);

  try {
    // 1. Presigned URL 요청
    console.log('\n1. Presigned URL 요청 중...');
    const presignResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: PASSWORD,
        fileName: 'test-image.png',
        contentType: 'image/png',
      }),
    });

    console.log('   응답 상태:', presignResponse.status, presignResponse.statusText);

    if (!presignResponse.ok) {
      const errorText = await presignResponse.text();
      console.error('   오류 응답:', errorText);
      return;
    }

    const presignData = await presignResponse.json();
    console.log('   Presigned URL 생성 성공!');
    console.log('   - Upload URL:', presignData.uploadUrl ? '있음' : '없음');
    console.log('   - Object Key:', presignData.objectKey);
    console.log('   - Public URL:', presignData.publicUrl);

    if (!presignData.uploadUrl) {
      console.error('   Upload URL이 없습니다.');
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
      console.log('\n3. 업로드된 파일 확인...');
      const checkResponse = await fetch(presignData.publicUrl);
      console.log('   파일 접근 상태:', checkResponse.status);

      if (checkResponse.ok) {
        console.log('   ✅ 파일이 정상적으로 업로드되었습니다!');
      } else {
        console.log('   ⚠️ 파일에 접근할 수 없습니다. (권한 설정 확인 필요)');
      }
    } else {
      const errorText = await uploadResponse.text();
      console.error('   ❌ 업로드 실패:', errorText);
    }

  } catch (error) {
    console.error('\n오류 발생:', error.message);
    console.error('스택:', error.stack);
  } finally {
    // 테스트 이미지 삭제
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('\n테스트 이미지 삭제 완료');
    }
  }

  console.log('\n=== 테스트 종료 ===');
}

// 테스트 실행
testThumbnailUpload();