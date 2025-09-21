# MongoDB Collection Name Mismatch 트러블슈팅

## 문제 상황
- **날짜**: 2025-09-21
- **증상**: 나라똔튜브 삭제/수정 API에서 "해당 항목을 찾을 수 없습니다" 404 에러 발생
- **에러 메시지**:
  ```
  해당 항목을 찾을 수 없습니다.
  /api/naraddon-tube/delete:1 Failed to load resource: the server responded with a status of 404 ()
  ```

## 원인 분석
1. **MongoDB 연결 방식 불일치**
   - 메인 route.ts: Mongoose 사용 (mongoose.model)
   - delete/update route.ts: MongoDB Native Driver 사용 (MongoClient)

2. **컬렉션 이름 차이**
   - Mongoose 모델명: `NaraddonTubeEntry`
   - Mongoose가 자동 생성하는 컬렉션명: `naraddontubeentries` (복수형, 소문자)
   - 잘못 사용한 컬렉션명: `naraddon-tube`

3. **Import 방식 문제**
   - 초기: `import { connectDB } from '@/lib/mongodb'` (named import)
   - 실제: `export default connectDB` (default export)

## 해결 과정

### 1단계: ObjectId 변환 문제 확인
```typescript
// 수정 전
const entry = await collection.findOne({ _id: entryId });

// 수정 후
const entry = await collection.findOne({ _id: new ObjectId(entryId) });
```

### 2단계: MongoDB 연결 방식 수정
```typescript
// 수정 전
import connectDB from '@/lib/mongodb'; // Mongoose 연결

// 수정 후
import clientPromise from '@/lib/mongodb-client'; // MongoDB Native Driver
```

### 3단계: 컬렉션 이름 수정 (최종 해결책)
```typescript
// 수정 전
const collection = db.collection('naraddon-tube');

// 수정 후
const collection = db.collection('naraddontubeentries');
```

## 교훈
1. **Mongoose와 MongoDB Native Driver 혼용 주의**
   - Mongoose 모델을 사용하는 경우 컬렉션 이름이 자동 변환됨
   - 모델명을 복수형 소문자로 변환 (NaraddonTubeEntry → naraddontubeentries)

2. **디버깅 팁**
   - 컬렉션 이름 확인: `db.getCollectionNames()`
   - 샘플 문서 확인: `collection.find({}).limit(1).toArray()`
   - _id 타입 확인: `typeof document._id`

3. **일관성 유지**
   - 프로젝트 전체에서 Mongoose 또는 Native Driver 중 하나만 사용
   - 혼용이 필요한 경우 컬렉션 이름을 명시적으로 지정

## 참고사항
- MongoDB Atlas 대시보드에서 실제 컬렉션 이름 확인 가능
- Mongoose의 자동 컬렉션 이름 변환 규칙:
  - 모델명을 소문자로 변환
  - 끝에 's' 추가 (복수형)
  - CamelCase를 lowercase로 변환