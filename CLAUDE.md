# Claude 작업 가이드

## 환경변수 설정

Notion API 연동이 필요한 경우:
```
NOTION_API_KEY=환경변수로_설정_필요
```

스크립트 위치: `/scripts/notion-upload-env.js`

## 프로젝트 정보

### 저장소
- **테스트**: `naraddon-homepage-test` (Private)
- **프로덕션**: `naraddon-homepage` (Public)

### 기술 스택
- Next.js 14 (App Router)
- TypeScript
- MongoDB Atlas
- Cloudflare R2
- Vercel

### 주요 서비스 비밀번호
- `NARADDON_TUBE_PASSWORD`: vhffkvhffk82
- 기타 서비스들은 환경변수 문서 참조

### 배포 프로세스
```bash
# 테스트 저장소
git push test main

# 프로덕션 저장소
git push naraddon main

# Vercel 자동 배포 트리거
```

## 중요 주의사항

### ⚠️ 환경변수 설정 시
- **반드시 `echo -n` 사용** (줄바꿈 제거)
- 따옴표 포함하지 않기
- Windows에서 작업 시 `\r\n` 주의

### 🔒 보안
- `.env.local` 절대 커밋 금지
- API Key 노출 금지
- 비밀번호 하드코딩 금지

## 트러블슈팅 체크리스트

문제 발생 시 확인 순서:
1. Vercel 환경변수 확인
2. 줄바꿈 문자 제거 여부
3. MongoDB 연결 상태
4. Cloudflare R2 설정
5. 배포 상태 확인

## 긴급 연락처

- Vercel Dashboard: https://vercel.com
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudflare: https://dash.cloudflare.com
- Notion: https://www.notion.so

---
*이 문서는 Claude가 참조하는 기본 가이드입니다.*
*최종 업데이트: 2025-09-21*