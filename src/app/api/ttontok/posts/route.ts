import { NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import TtontokPost, { TtontokCategory } from '@/models/TtontokPost';

// API Route를 동적으로 설정 (환경변수 문제 해결)
export const dynamic = 'force-dynamic';

const WRITE_PASSWORD = process.env.TTONTOK_WRITE_PASSWORD || 'vhffkvhffk82';
const DEFAULT_NICKNAME =
  process.env.TTONTOK_DEFAULT_NICKNAME ||
  process.env.NEXT_PUBLIC_TTONTOK_DEFAULT_NICKNAME ||
  '오늘의 사장님';

const ALLOWED_TTONTOK_CATEGORIES: readonly TtontokCategory[] = [
  'funding',
  'tax',
  'hr',
  'marketing',
  'strategy',
  'tech',
  'legal',
  'etc',
];

const normalizeCategory = (value: unknown): TtontokCategory | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  return ALLOWED_TTONTOK_CATEGORIES.includes(normalized as TtontokCategory)
    ? (normalized as TtontokCategory)
    : null;
};

const sanitizeOptionalText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

const sanitizeOptionalNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

export async function GET() {
  await connectDB();

  const posts = await TtontokPost.find()
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    posts: posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString() ?? null,
      updatedAt: post.updatedAt?.toISOString() ?? null,
    })),
  });
}

export async function POST(request: Request) {
  await connectDB();

  let body: Record<string, unknown> | null = null;
  try {
    body = await request.json();
  } catch (error) {
    console.error('[ttontok/posts][POST] invalid JSON payload', error);
    return NextResponse.json({ message: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  const {
    password,
    category,
    title,
    content,
    nickname,
    isAnonymous,
    businessType,
    region,
    yearsInBusiness,
  } = (body ?? {}) as {
    password?: string;
    category?: unknown;
    title?: unknown;
    content?: unknown;
    nickname?: unknown;
    isAnonymous?: unknown;
    businessType?: unknown;
    region?: unknown;
    yearsInBusiness?: unknown;
  };

  if (!password || password !== WRITE_PASSWORD) {
    return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const resolvedCategory = normalizeCategory(category);
  if (!resolvedCategory) {
    return NextResponse.json({ message: '유효한 카테고리를 선택해주세요.' }, { status: 400 });
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ message: '제목을 입력해주세요.' }, { status: 400 });
  }

  if (!content || typeof content !== 'string' || content.trim().length < 30) {
    return NextResponse.json({ message: '내용은 최소 30자 이상 입력해주세요.' }, { status: 400 });
  }

  const isAnonymousFlag = typeof isAnonymous === 'boolean' ? isAnonymous : false;
  const rawNickname = typeof nickname === 'string' ? nickname : '';
  const resolvedNickname = (isAnonymousFlag ? '익명' : rawNickname || DEFAULT_NICKNAME).trim();

  try {
    const post = await TtontokPost.create({
      category: resolvedCategory,
      title: title.trim(),
      content: content.trim(),
      nickname: resolvedNickname,
      isAnonymous: isAnonymousFlag,
      businessType: isAnonymousFlag ? '' : sanitizeOptionalText(businessType),
      region: isAnonymousFlag ? '' : sanitizeOptionalText(region),
      yearsInBusiness: isAnonymousFlag ? null : sanitizeOptionalNumber(yearsInBusiness),
    });

    return NextResponse.json(
      {
        post: {
          ...post.toObject(),
          _id: post._id.toString(),
          createdAt: post.createdAt?.toISOString() ?? null,
          updatedAt: post.updatedAt?.toISOString() ?? null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ttontok/posts][POST] failed to create post', error);
    const status = (error as { name?: string })?.name === 'ValidationError' ? 400 : 500;
    const message =
      status === 400
        ? '입력값을 다시 확인해주세요.'
        : '게시글 등록에 실패했습니다.';
    return NextResponse.json({ message }, { status });
  }
}

