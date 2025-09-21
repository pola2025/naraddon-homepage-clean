const fs = require('fs');
const path = require('path');

// OpenAI API 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';
const MODEL = 'gpt-5-codex-high'; // GPT-5-Codex High 모델

async function callCodex(prompt, context = '') {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are GPT-5-Codex High, an expert coding assistant specialized in building modern web applications with Next.js, React, and TypeScript.'
          },
          {
            role: 'user',
            content: context ? `Context:\n${context}\n\nTask:\n${prompt}` : prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Codex API 호출 실패:', error);
    throw error;
  }
}

// 파일 읽기 헬퍼
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`파일 읽기 실패 (${filePath}):`, error.message);
    return null;
  }
}

// 파일 쓰기 헬퍼
function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ 파일 생성/수정 완료: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`파일 쓰기 실패 (${filePath}):`, error.message);
    return false;
  }
}

// 홈페이지 구축 요청 함수
async function buildHomePage(request) {
  console.log('🚀 GPT-5-Codex High 모델로 홈페이지 구축 시작...\n');

  // 현재 프로젝트 구조 분석
  const projectStructure = `
    프로젝트: Next.js 14 (App Router)
    스타일링: Tailwind CSS
    언어: TypeScript/JavaScript

    현재 구조:
    - src/app: 페이지 라우트
    - src/components: 재사용 컴포넌트
    - public: 정적 파일
  `;

  // 현재 메인 페이지 코드 읽기
  const currentHomePage = readFile('src/components/home/Home.js');

  const context = `
    ${projectStructure}

    현재 Home.js 파일:
    ${currentHomePage ? currentHomePage.substring(0, 1000) + '...' : '파일 없음'}
  `;

  try {
    // Codex에 요청
    const response = await callCodex(request, context);

    console.log('📝 Codex 응답:\n');
    console.log(response);

    // 응답에서 코드 블록 추출 및 파일 생성
    const codeBlocks = response.match(/```[\s\S]*?```/g);

    if (codeBlocks) {
      console.log('\n📂 코드 생성 중...\n');

      codeBlocks.forEach((block, index) => {
        // 파일명 추출 시도
        const fileMatch = block.match(/```(\w+)?\s*(?:\/\/|#|<!--)?\s*(.+\.\w+)/);
        if (fileMatch) {
          const fileName = fileMatch[2].trim();
          const code = block.replace(/```[\w]*\n?/, '').replace(/```$/, '').trim();

          // 파일 경로 결정
          let filePath = fileName;
          if (!fileName.startsWith('src/') && !fileName.startsWith('public/')) {
            filePath = `src/components/${fileName}`;
          }

          writeFile(filePath, code);
        }
      });
    }

    return response;
  } catch (error) {
    console.error('❌ 홈페이지 구축 실패:', error);
    return null;
  }
}

// CLI 인터페이스
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('사용법: node codex-api.js "요청 내용"');
    console.log('예시: node codex-api.js "모던한 랜딩 페이지 만들어줘"');
    return;
  }

  const request = args.join(' ');
  await buildHomePage(request);
}

// 모듈로 사용하거나 직접 실행
if (require.main === module) {
  main();
}

module.exports = { callCodex, buildHomePage };