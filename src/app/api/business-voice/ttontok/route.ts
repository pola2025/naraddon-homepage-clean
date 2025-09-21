import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

import connectDB from '@/lib/mongodb';
import TtontokPost, { ITtontokPost, TtontokCategory } from '@/models/TtontokPost';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const parseNumber = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeCategory = (value: string | null): TtontokCategory | undefined => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  const allowed: TtontokCategory[] = ['funding', 'tax', 'hr', 'marketing', 'strategy', 'tech', 'legal', 'etc'];
  return allowed.includes(normalized as TtontokCategory) ? (normalized as TtontokCategory) : undefined;
};

const parseSort = (value: string | null) => {
  switch ((value ?? '').toLowerCase()) {
    case 'popular':
      return { likeCount: -1, viewCount: -1, createdAt: -1 } as const;
    case 'discussed':
      return { replyCount: -1, createdAt: -1 } as const;
    case 'latest':
    default:
      return { createdAt: -1 } as const;
  }
};

const sanitizeString = (value: unknown, { maxLength = 500 }: { maxLength?: number } = {}) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

const sanitizeTags = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
        .filter((tag) => tag.length > 0)
        .slice(0, 10)
    )
  );
};

const toObjectId = (value: unknown): Types.ObjectId | undefined => {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  if (!Types.ObjectId.isValid(value)) return undefined;
  return new Types.ObjectId(value);
};

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = Math.max(parseNumber(searchParams.get('page'), 1), 1);
  const limit = Math.min(parseNumber(searchParams.get('limit'), DEFAULT_LIMIT), MAX_LIMIT);
  const category = normalizeCategory(searchParams.get('category'));
  const sort = parseSort(searchParams.get('sort'));

  const query: Record<string, unknown> = { isArchived: false };
  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    TtontokPost.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean<ITtontokPost[]>(),
    TtontokPost.countDocuments(query),
  ]);

  return NextResponse.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items: items.map((item) => ({
      id: item._id,
      title: item.title,
      category: item.category,
      nickname: item.nickname,
      tags: item.tags,
      viewCount: item.viewCount,
      likeCount: item.likeCount,
      replyCount: item.replyCount,
      isPinned: item.isPinned,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  await connectDB();

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch (error) {
    console.error('[ttontok] invalid JSON payload', error);
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const title = sanitizeString(payload.title, { maxLength: 200 });
  const content = sanitizeString(payload.content, { maxLength: 5000 });
  const nickname = sanitizeString(payload.nickname, { maxLength: 24 });
  const category = normalizeCategory(typeof payload.category === 'string' ? payload.category : null);
  const tags = sanitizeTags(payload.tags);

  if (!title || !content || !nickname || !category) {
    return NextResponse.json(
      { message: '제목, 내용, 닉네임, 카테고리를 확인해 주세요.' },
      { status: 400 }
    );
  }

  const memberObjectId = toObjectId(payload.memberId);

  try {
    const created = await TtontokPost.create({
      title,
      content,
      nickname,
      category,
      tags,
      memberId: memberObjectId,
    });

    return NextResponse.json(
      {
        id: created._id,
        title: created.title,
        category: created.category,
        nickname: created.nickname,
        tags: created.tags,
        viewCount: created.viewCount,
        likeCount: created.likeCount,
        replyCount: created.replyCount,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ttontok] failed to create post', error);
    return NextResponse.json({ message: '게시글을 저장하지 못했습니다.' }, { status: 500 });
  }
}