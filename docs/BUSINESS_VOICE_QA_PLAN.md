# Business Voice Q&A 데이터 및 레이어링 기획

## 1. 데이터 모델 제안

### Question (collection: businessVoiceQuestions)
- `title` (string, required)
- `summary` (string, optional)
- `content` (string, required, 300자 이내)
- `category` (enum: funding, tax, employment, marketing, operations, energy, policy, export, franchise, retail, fnb 등)
- `authorNickname` (string, required)
- `authorProfile` (object)
  - `businessType` (string)
  - `region` (string)
  - `yearsInBusiness` (number, optional)
- `metrics`
  - `viewCount` (number, default 0)
  - `commentCount` (number, default 0)
  - `scrapCount` (number, default 0)
- `flags`
  - `needsExpertReply` (boolean)
  - `needsExaminerReply` (boolean)
- `sources` (array)
  - `title`
  - `url`
  - `publishedAt`
  - `publisher`
- `createdAt` / `updatedAt`

### Answer (collection: businessVoiceAnswers)
- `questionId` (ObjectId)
- `role` (enum: owner, expert, examiner, consultant)
- `isPinned` (boolean)
- `nickname`
- `organization`
- `title` (string, optional)
- `content` (string, 최대 350자)
- `cta` (object, optional)
  - `label`
  - `href`
- `sources` (array 구조 동일)
- `createdAt` / `updatedAt`
- `upvotes`

### API 응답 예시
```json
{
  "questions": [
    {
      "id": "...",
      "title": "2025년 최저임금 인상 이후 야간 인건비 부담",
      "content": "...",
      "category": "employment",
      "author": {
        "nickname": "baristamaker",
        "businessType": "카페",
        "region": "서울 마포"
      },
      "flags": {
        "needsExpertReply": true,
        "needsExaminerReply": false
      },
      "sources": [
        {
          "title": "2025년 최저임금 10630원 확정",
          "publisher": "고용노동부",
          "url": "https://...",
          "publishedAt": "2024-07-16"
        }
      ],
      "answers": [
        {
          "role": "expert",
          "isPinned": true,
          "content": "...",
          "nickname": "payroll_sujin",
          "organization": "나라똔 노무지원센터"
        },
        {
          "role": "owner",
          "content": "..."
        }
      ]
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "pageSize": 20
  }
}
```

## 2. API 라우트 설계
- `GET /api/business-voice/questions`
  - 쿼리: `category`, `limit`, `cursor`, `needsExpert`
  - 응답: 질문 배열 + 상단 고정 답변 정렬(전문가/심사관 → 기타)
- `GET /api/business-voice/questions/[id]`
  - 단일 질문 상세, 답변 전체
- `POST /api/business-voice/questions`
  - (향후) 인증 사용자 문의 작성
- `POST /api/business-voice/questions/[id]/answers`
  - (향후)

## 3. 프론트엔드 연동 전략
1. 서버 컴포넌트(Fetch 캐싱)로 질문 데이터를 prefetch 후 클라이언트 컴포넌트에 props로 전달.
2. 상단 BEST 영역은 API의 `isPinned` 및 `role`을 이용해 정렬.
3. 댓글 토글 시 `answers` 배열 렌더링, 전문가/심사관은 카드 배경과 배지를 변경.
4. 80%의 문장은 150자 이내이므로 목록/요약 형태, 20%는 펼치기 버튼으로 전체 보기 처리.

## 4. 전문가·심사관 답변 레이어링 기획
- **레이어 1 (Pinned Expert/Examiner Capsule)**
  - 질문 카드 상단에 배치, 파란색/초록색 그라디언트 배경, 배지(`Expert Insight`, `심사관 공식 답변`).
  - 아이콘: `fa-lightbulb` (expert), `fa-shield-check` (examiner).
  - 좌측에 vertial accent bar, hover 시 box-shadow 강화.
- **레이어 2 (Community Answers)**
  - 기본 화이트 카드, 연한 회색 보더, role badge(tag) 표시.
  - 전문가/심사관 이후 나머지 답변은 collapsed 상태로 표시, `더보기`로 확장.
- **레이어 3 (Action Footer)**
  - `추가 상담 요청` CTA (StandardBottomCta 컴포넌트 재활용)로 전문가 연결.
  - `자료 출처 보기` 토글 버튼 제공 → 모달에 기사/정부 문서 링크 표시.

### 상호작용 흐름
1. API에서 `answers` 배열 수신 후 `role` 순서(`expert` > `examiner` > `consultant` > others)로 정렬.
2. 최상단 답변은 `PinnedLayer` 컴포넌트로 감싸며 카드 상단에 고정.
3. 일반 답변은 아코디언 내에 배치, 배지/아이콘으로 role 표시.
4. `needsExpertReply` true인데 pinned 답변이 없을 경우, `전문가 답변 모집 중` 배너 출력.

## 5. 데이터 품질 가이드
- 닉네임: 알파벳+숫자 혼합 또는 실제 커뮤니티 스타일(예: `roastery_mint`, `startupjoy`)
- 본문: 80% ≤ 150자, 20% ≤ 300자.
- 사실 검증: 정부·지자체·금융권·언론 기사 URL 저장 후 QA.
- 감성: 질문은 현실 고충, 답변은 실무 팁/정책 안내 중심.

## 6. 차후 확장 아이디어
- MongoDB 전체텍스트 인덱스(`title`, `content`).
- `GET /api/business-voice/questions/trending` (views/likes 기반).
- Admin 백오피스에서 전문가 답변 등록.
- 알림: `POST /api/notifications` 와 Webhook 연계.
