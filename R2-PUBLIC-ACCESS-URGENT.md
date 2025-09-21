# ⚠️ 긴급: R2 Public Access 설정 필요

## 문제 상황
- **증상**: 나라똔튜브 썸네일이 표시되지 않음
- **원인**: R2 버킷이 public access를 허용하지 않음 (401 Unauthorized)
- **에러**: `[NaraddonTube] Thumbnail load failed: https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev/...`

## 즉시 해결 방법

### 1. Cloudflare Dashboard 접속
- URL: https://dash.cloudflare.com
- 로그인 후 R2 섹션으로 이동

### 2. R2 버킷 설정 변경
1. `naraddon-assets` 버킷 선택
2. **Settings** 탭 클릭
3. **Public Access** 섹션 찾기
4. **"Allow public access"** 토글 ON
5. 경고 메시지 확인 후 **Confirm** 클릭

### 3. Public Domain 확인
- 활성화 후 제공되는 도메인 확인
- 예: `https://pub-b520cb8ed3989e8182bdb020ade36495.r2.dev`

## 현재 상태
- ✅ 업로드: presigned URL로 정상 작동
- ❌ 조회: public URL 접근 불가 (401 에러)
- ❌ 썸네일 표시: 실패

## 설정 후 확인사항
1. 브라우저에서 썸네일 URL 직접 접속 테스트
2. naraddon.com 에서 나라똔튜브 썸네일 표시 확인
3. 콘솔 에러 사라졌는지 확인

## 보안 고려사항
- Public Access 활성화 시 모든 파일이 공개됨
- 썸네일 이미지만 업로드하도록 주의
- 민감한 데이터는 절대 업로드 금지

---
*작성일: 2025-09-21*
*긴급도: 높음*