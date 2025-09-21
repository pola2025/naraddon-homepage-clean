# 🏗️ 나라똔 홈페이지 아키텍처 및 안정성 가이드라인

## 📋 목차

1. [클린 아키텍처 원칙](#클린-아키텍처-원칙)
2. [컴포넌트 설계 원칙](#컴포넌트-설계-원칙)
3. [React 최적화 가이드](#react-최적화-가이드)
4. [상태 관리 전략](#상태-관리-전략)
5. [테스팅 및 안정성](#테스팅-및-안정성)
6. [성능 모니터링](#성능-모니터링)

---

## 🎯 클린 아키텍처 원칙

### 1. 계층 구조

```
┌─────────────────────────────────────┐
│           Presentation              │  ← UI Components, Pages
├─────────────────────────────────────┤
│           Application               │  ← Business Logic, Use Cases
├─────────────────────────────────────┤
│              Domain                 │  ← Core Business Rules, Entities
├─────────────────────────────────────┤
│          Infrastructure             │  ← External Services, DB, APIs
└─────────────────────────────────────┘
```

### 2. 폴더 구조

```typescript
src/
├── presentation/          # UI 레이어
│   ├── components/       # 재사용 가능한 컴포넌트
│   ├── pages/           # 페이지 컴포넌트
│   └── layouts/         # 레이아웃 컴포넌트
├── application/          # 애플리케이션 로직
│   ├── hooks/           # 커스텀 훅
│   ├── services/        # 비즈니스 로직 서비스
│   └── contexts/        # React Context
├── domain/              # 도메인 레이어
│   ├── entities/        # 핵심 엔티티
│   ├── interfaces/      # 인터페이스 정의
│   └── types/          # 타입 정의
└── infrastructure/       # 인프라 레이어
    ├── api/            # API 클라이언트
    ├── config/         # 설정 파일
    └── utils/          # 유틸리티 함수
```

### 3. 의존성 규칙

```typescript
// ✅ GOOD: 상위 계층이 하위 계층에 의존
import { UserEntity } from '@/domain/entities/User';
import { UserService } from '@/application/services/UserService';

// ❌ BAD: 하위 계층이 상위 계층에 의존
// infrastructure 계층에서 presentation 계층 import 금지
```

### 4. 의존성 역전 원칙 (DIP)

```typescript
// domain/interfaces/UserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User>;
  save(user: User): Promise<void>;
}

// infrastructure/repositories/UserRepository.ts
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User> {
    // 실제 구현
  }

  async save(user: User): Promise<void> {
    // 실제 구현
  }
}

// application/services/UserService.ts
export class UserService {
  constructor(private repository: IUserRepository) {}

  async getUser(id: string) {
    return this.repository.findById(id);
  }
}
```

---

## 🧩 컴포넌트 설계 원칙

### 1. 단일 책임 원칙 (SRP)

```typescript
// ✅ GOOD: 하나의 책임만 가진 컴포넌트
const UserAvatar = ({ user }: { user: User }) => {
  return <img src={user.avatar} alt={user.name} />;
};

const UserInfo = ({ user }: { user: User }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// ❌ BAD: 여러 책임을 가진 컴포넌트
const UserCard = ({ user, onEdit, onDelete, showModal }) => {
  // 너무 많은 책임
};
```

### 2. 컴포넌트 분리 전략

```typescript
// presentation/components/atoms/Button.tsx
export const Button = ({ children, onClick, variant }) => {
  return (
    <button className={styles[variant]} onClick={onClick}>
      {children}
    </button>
  );
};

// presentation/components/molecules/SearchBar.tsx
export const SearchBar = ({ onSearch }) => {
  return (
    <div>
      <Input onChange={handleChange} />
      <Button onClick={onSearch}>Search</Button>
    </div>
  );
};

// presentation/components/organisms/Header.tsx
export const Header = () => {
  return (
    <header>
      <Logo />
      <Navigation />
      <SearchBar />
    </header>
  );
};
```

### 3. Props 인터페이스 정의

```typescript
// ✅ GOOD: 명확한 Props 타입 정의
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
}) => {
  // 구현
};
```

### 4. 컴포넌트 조합 패턴

```typescript
// Compound Component Pattern
const Card = ({ children }) => <div className="card">{children}</div>;
Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// 사용 예시
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
```

---

## ⚡ React 최적화 가이드

### 1. useEffect 최소화

```typescript
// ❌ BAD: useEffect 남용
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  useEffect(() => {
    if (user) {
      fetchPosts(user.id).then(setPosts);
    }
  }, [user]);

  useEffect(() => {
    setLoading(!user || posts.length === 0);
  }, [user, posts]);
};

// ✅ GOOD: 선언적 접근 + 커스텀 훅
const useUserWithPosts = (userId: string) => {
  return useQuery({
    queryKey: ['user-with-posts', userId],
    queryFn: async () => {
      const user = await fetchUser(userId);
      const posts = await fetchPosts(user.id);
      return { user, posts };
    },
  });
};

const UserProfile = ({ userId }) => {
  const { data, isLoading } = useUserWithPosts(userId);

  if (isLoading) return <Spinner />;
  return <ProfileView user={data.user} posts={data.posts} />;
};
```

### 2. 메모이제이션 전략

```typescript
// ✅ GOOD: 필요한 경우에만 메모이제이션
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  // 복잡한 렌더링 로직
  const processedData = useMemo(() => {
    return heavyDataProcessing(data);
  }, [data]);

  const handleClick = useCallback((id) => {
    onUpdate(id, processedData);
  }, [onUpdate, processedData]);

  return <div onClick={handleClick}>{/* 렌더링 */}</div>;
});

// ❌ BAD: 불필요한 메모이제이션
const SimpleComponent = React.memo(({ title }) => {
  // 단순한 컴포넌트에 불필요한 memo
  const uppercaseTitle = useMemo(() => title.toUpperCase(), [title]);
  return <h1>{uppercaseTitle}</h1>;
});
```

### 3. 상태 끌어올리기 최소화

```typescript
// ✅ GOOD: 로컬 상태 유지
const SearchInput = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    // 제출 시에만 부모로 전달
    onSearch(query);
  };

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
    />
  );
};

// ❌ BAD: 불필요한 상태 끌어올리기
const Parent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // 모든 입력마다 부모 컴포넌트 리렌더링
  return <SearchInput value={searchQuery} onChange={setSearchQuery} />;
};
```

### 4. 코드 스플리팅

```typescript
// 라우트 기반 코드 스플리팅
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}

// 컴포넌트 레벨 코드 스플리팅
const HeavyChart = lazy(() => import('./components/HeavyChart'));

const AnalyticsPage = () => {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Chart</button>
      {showChart && (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
};
```

---

## 🎨 상태 관리 전략

### 1. 상태 레벨 구분

```typescript
// 1. 로컬 상태: 단일 컴포넌트
const [isOpen, setIsOpen] = useState(false);

// 2. 공유 상태: Context API
const ThemeContext = createContext<Theme>('light');

// 3. 서버 상태: React Query / SWR
const { data, error } = useQuery(['user', id], fetchUser);

// 4. 전역 상태: Zustand / Redux
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// 5. URL 상태: 라우터
const [searchParams, setSearchParams] = useSearchParams();
```

### 2. 상태 정규화

```typescript
// ✅ GOOD: 정규화된 상태
interface State {
  entities: {
    users: Record<string, User>;
    posts: Record<string, Post>;
  };
  ui: {
    selectedUserId: string | null;
    isLoading: boolean;
  };
}

// ❌ BAD: 중첩된 상태
interface BadState {
  users: Array<{
    id: string;
    name: string;
    posts: Array<{
      id: string;
      title: string;
      comments: Comment[];
    }>;
  }>;
}
```

### 3. 낙관적 업데이트

```typescript
const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // 쿼리 취소
      await queryClient.cancelQueries(['user', newUser.id]);

      // 이전 값 저장
      const previousUser = queryClient.getQueryData(['user', newUser.id]);

      // 낙관적 업데이트
      queryClient.setQueryData(['user', newUser.id], newUser);

      return { previousUser };
    },
    onError: (err, newUser, context) => {
      // 롤백
      queryClient.setQueryData(
        ['user', newUser.id],
        context.previousUser
      );
    },
    onSettled: () => {
      // 리페치
      queryClient.invalidateQueries(['user']);
    },
  });
};
```

---

## 🧪 테스팅 및 안정성

### 1. 테스트 피라미드

```
         /\
        /  \  E2E Tests (10%)
       /____\
      /      \  Integration Tests (30%)
     /________\
    /          \  Unit Tests (60%)
   /____________\
```

### 2. 단위 테스트

```typescript
// UserService.test.ts
describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new UserService(mockRepository);
  });

  it('should fetch user by id', async () => {
    const mockUser = { id: '1', name: 'Test' };
    mockRepository.findById.mockResolvedValue(mockUser);

    const result = await service.getUser('1');

    expect(result).toEqual(mockUser);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });
});
```

### 3. 컴포넌트 테스트

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';

describe('Button Component', () => {
  it('should render children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 4. 에러 바운더리

```typescript
class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 로깅 서비스로 전송
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// 사용
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 5. 타입 안정성

```typescript
// strict TypeScript 설정
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}

// Zod를 사용한 런타임 검증
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().positive().optional(),
});

type User = z.infer<typeof UserSchema>;

const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};
```

---

## 📊 성능 모니터링

### 1. Web Vitals 측정

```typescript
// utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);  // Cumulative Layout Shift
    getFID(onPerfEntry);  // First Input Delay
    getFCP(onPerfEntry);  // First Contentful Paint
    getLCP(onPerfEntry);  // Largest Contentful Paint
    getTTFB(onPerfEntry); // Time to First Byte
  }
};

// 사용
reportWebVitals((metric) => {
  // Analytics로 전송
  analytics.send({
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
});
```

### 2. React DevTools Profiler

```typescript
import { Profiler } from 'react';

const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) => {
  // 성능 데이터 수집
  console.log(`Component ${id} (${phase}): ${actualDuration}ms`);
};

<Profiler id="Navigation" onRender={onRenderCallback}>
  <Navigation />
</Profiler>
```

### 3. 번들 사이즈 최적화

```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    // Bundle Analyzer
    if (process.env.ANALYZE) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin;
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }
    return config;
  },
};
```

### 4. 이미지 최적화

```typescript
import Image from 'next/image';

// Next.js Image 컴포넌트 사용
const OptimizedImage = () => (
  <Image
    src="/hero.jpg"
    alt="Hero"
    width={1200}
    height={600}
    priority // LCP 이미지
    placeholder="blur"
    blurDataURL={shimmer}
  />
);

// 반응형 이미지
<Image
  src="/photo.jpg"
  alt="Photo"
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
  fill
  style={{ objectFit: 'cover' }}
/>
```

---

## 🛡️ 보안 고려사항

### 1. XSS 방지

```typescript
// ❌ BAD: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ GOOD: 텍스트로 렌더링 또는 살균
import DOMPurify from 'dompurify';

const SafeHTML = ({ content }: { content: string }) => {
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

### 2. 환경 변수 관리

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=never_expose_this # 서버 사이드만

// 사용
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // 클라이언트 OK
const secret = process.env.SECRET_KEY; // 서버 사이드만
```

### 3. CSRF 토큰

```typescript
// middleware.ts에서 CSRF 토큰 검증
import { CSRFProtection } from '@/lib/security';

export async function middleware(request: NextRequest) {
  if (request.method === 'POST' || request.method === 'PUT') {
    const token = request.headers.get('X-CSRF-Token');
    const sessionToken = request.cookies.get('csrf-token')?.value;

    if (!CSRFProtection.validateToken(token, sessionToken)) {
      return new NextResponse('Invalid CSRF Token', { status: 403 });
    }
  }
}
```

---

## 📝 체크리스트

### 아키텍처 체크리스트

- [ ] 계층 간 의존성 방향이 올바른가?
- [ ] 각 컴포넌트가 단일 책임을 가지는가?
- [ ] 인터페이스를 통한 의존성 역전이 적용되었는가?
- [ ] 도메인 로직이 프레임워크에 독립적인가?

### 성능 체크리스트

- [ ] 불필요한 useEffect를 제거했는가?
- [ ] 메모이제이션이 적절히 사용되었는가?
- [ ] 코드 스플리팅이 적용되었는가?
- [ ] 이미지 최적화가 되어있는가?
- [ ] 번들 사이즈가 적절한가?

### 안정성 체크리스트

- [ ] TypeScript strict 모드가 활성화되었는가?
- [ ] 에러 바운더리가 구현되었는가?
- [ ] 입력 검증이 적용되었는가?
- [ ] 테스트 커버리지가 충분한가?
- [ ] 보안 헤더가 설정되었는가?

### 테스트 체크리스트

- [ ] 단위 테스트가 작성되었는가?
- [ ] 통합 테스트가 작성되었는가?
- [ ] E2E 테스트 시나리오가 있는가?
- [ ] 에러 케이스가 테스트되었는가?

---

## 🔧 도구 및 라이브러리

### 필수 도구

```json
{
  "dependencies": {
    "next": "latest",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### ESLint 설정

```javascript
module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-explicit-any': 'error'
  }
};
```

---

*최종 업데이트: 2025년 1월 18일*
*버전: 1.0.0*