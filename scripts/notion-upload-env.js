// Notion Upload Script with Environment Variable
// API Key는 환경변수 NOTION_API_KEY로 설정

const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

// 환경변수에서 API 키 가져오기
const NOTION_API_KEY = process.env.NOTION_API_KEY;

if (!NOTION_API_KEY) {
  console.error('❌ NOTION_API_KEY 환경변수가 설정되지 않았습니다.');
  console.log('💡 .env.local 파일에 다음을 추가해주세요:');
  console.log('   NOTION_API_KEY=your_notion_api_key_here');
  process.exit(1);
}

// Notion 클라이언트 초기화
const notion = new Client({
  auth: NOTION_API_KEY,
});

// 사용 예시
async function createPage() {
  try {
    // 페이지 생성 로직
    console.log('✅ Notion API 연결 성공');
    // ... 페이지 생성 코드
  } catch (error) {
    console.error('❌ Notion API 오류:', error);
  }
}

// 실행
if (require.main === module) {
  createPage();
}

module.exports = { notion };