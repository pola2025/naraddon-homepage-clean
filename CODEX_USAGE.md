# GPT-5-Codex High API 사용 가이드

## 준비사항

1. **API 키 설정**
   `.env.local` 파일에서 OpenAI API 키를 설정하세요:
   ```
   OPENAI_API_KEY=your-actual-api-key-here
   ```

2. **Python 의존성 설치** (Python 버전 사용시)
   ```bash
   pip install requests python-dotenv
   ```

## 사용 방법

### Node.js 버전 (codex-api.js)

```bash
# 기본 사용법
node codex-api.js "메인 페이지에 히어로 섹션 추가해줘"

# 예시들
node codex-api.js "모던한 네비게이션 바 만들어줘"
node codex-api.js "다크모드 토글 기능 구현"
node codex-api.js "반응형 카드 레이아웃 추가"
```

### Python 버전 (codex_api.py)

```bash
# 기본 사용법
python codex_api.py "푸터 섹션 디자인 개선"

# 대화형 모드
python codex_api.py --interactive

# 예시들
python codex_api.py "소셜 미디어 공유 버튼 추가"
python codex_api.py "페이지 로딩 애니메이션 구현"
python codex_api.py "연락처 폼 유효성 검사 추가"
```

## 주요 기능

### 1. 홈페이지 구축 요청
GPT-5-Codex가 현재 프로젝트 구조를 분석하고 요청에 맞게 코드를 생성합니다.

### 2. 자동 파일 생성/수정
응답에 포함된 코드 블록을 자동으로 파일로 저장합니다.

### 3. 프로젝트 컨텍스트 인식
- Next.js 14 App Router
- Tailwind CSS
- TypeScript/JavaScript
- MongoDB 연동

## 유용한 프롬프트 예시

### 컴포넌트 생성
```
"재사용 가능한 버튼 컴포넌트를 만들어줘. primary, secondary, danger 스타일 지원"
```

### 페이지 개선
```
"메인 페이지에 고객 후기 섹션을 추가해줘. 슬라이더 형태로"
```

### 기능 구현
```
"검색 기능을 구현해줘. 실시간 자동완성 포함"
```

### 성능 최적화
```
"이미지 레이지 로딩과 Next.js Image 컴포넌트를 사용해서 최적화"
```

### 애니메이션
```
"스크롤 트리거 애니메이션을 Framer Motion으로 구현"
```

## 주의사항

1. **API 키 보안**: API 키를 절대 공개 저장소에 커밋하지 마세요
2. **요청 제한**: OpenAI API 요청 제한을 확인하세요
3. **코드 검토**: 생성된 코드는 반드시 검토 후 사용하세요
4. **백업**: 중요한 파일은 수정 전 백업하세요

## 문제 해결

### API 키 오류
```
❌ API 에러: Invalid API key
```
→ `.env.local` 파일의 OPENAI_API_KEY를 확인하세요

### 모델 접근 오류
```
❌ API 에러: Model not found
```
→ GPT-5-Codex 모델 접근 권한을 확인하세요

### 파일 쓰기 오류
```
❌ 파일 쓰기 실패
```
→ 파일 경로와 권한을 확인하세요

## 고급 사용법

### JavaScript에서 모듈로 사용
```javascript
const { buildHomePage } = require('./codex-api');

async function main() {
  const result = await buildHomePage("네비게이션 메뉴 개선");
  console.log(result);
}
```

### Python에서 모듈로 사용
```python
from codex_api import build_homepage

response = build_homepage("푸터에 뉴스레터 구독 폼 추가")
```

## 지원 모델

- `gpt-5-codex-high`: 복잡한 작업, 대규모 리팩토링
- `gpt-5-codex`: 일반 코딩 작업
- `gpt-4-turbo`: 빠른 응답이 필요한 경우

필요에 따라 스크립트의 MODEL 변수를 수정하여 사용하세요.