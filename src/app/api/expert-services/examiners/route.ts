import { NextRequest, NextResponse } from 'next/server';

import { certifiedExaminers } from '@/data/certifiedExaminers';
import connectDB from '@/lib/mongodb';
import ExpertExaminer from '@/models/ExpertExaminer';

const SORT_ORDER = { sortOrder: 1, createdAt: -1 } as const;
const DEFAULT_CATEGORY = 'funding';
const LIST_SPLIT_REGEX = new RegExp('[,\\r\\n]+');

const getAdminPassword = () => process.env.EXPERT_SERVICES_ADMIN_PASSWORD ?? '';

const parseSpecialties = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item): item is string => Boolean(item));
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((item) => (typeof item === 'string' ? item.trim() : ''))
          .filter((item): item is string => Boolean(item))
      )
    );
  }

  if (typeof value === 'string' && value.trim()) {
    return Array.from(
      new Set(
        value
          .split(LIST_SPLIT_REGEX)
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );
  }

  return [];
};

const toNumberOrDefault = (value: unknown, fallback = 0) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

const toNullableNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return null;
};

const parseActivityStats = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const { totalAnswers, helpfulCount, averageResponseMinutes, lastActiveAt } = value as Record<
    string,
    unknown
  >;

  const parsedLastActive = (() => {
    if (lastActiveAt instanceof Date) {
      return Number.isNaN(lastActiveAt.valueOf()) ? null : lastActiveAt;
    }
    if (typeof lastActiveAt === 'string' && lastActiveAt.trim()) {
      const date = new Date(lastActiveAt);
      return Number.isNaN(date.valueOf()) ? null : date;
    }
    return null;
  })();

  return {
    totalAnswers: toNumberOrDefault(totalAnswers, 0),
    helpfulCount: toNumberOrDefault(helpfulCount, 0),
    averageResponseMinutes: toNullableNumber(averageResponseMinutes),
    lastActiveAt: parsedLastActive,
  };
};

const normalizeCategory = (value: unknown): string => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return DEFAULT_CATEGORY;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'examiner';

const seedExaminersIfNeeded = async () => {
  const total = await ExpertExaminer.countDocuments();
  if (total > 0) {
    return;
  }

  const seedRecords = certifiedExaminers.map((seed, index) => {
    const imageUrl = seed.imageKey ? `/images/examiners/${seed.imageKey}.png` : '';
    const legacyKey = seed.imageKey
      ? seed.imageKey.toLowerCase()
      : slugify(`${seed.name}-${index}`);
    return {
      name: seed.name,
      position: seed.position || '인증 기업심사관',
      companyName: seed.companyName ?? '',
      category: normalizeCategory(seed.category),
      specialties: parseSpecialties(seed.expertiseTags ?? []),
      imageUrl,
      imageAlt: `${seed.name} 인증 기업심사관`,
      sortOrder: index,
      legacyKey,
      isPublished: true,
    };
  });

  if (seedRecords.length > 0) {
    await ExpertExaminer.insertMany(seedRecords, { ordered: false });
  }
};

const handleDuplicateKeyError = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  ) {
    return NextResponse.json(
      { message: 'Legacy key already exists. Choose a different value.' },
      { status: 409 }
    );
  }
  return null;
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await seedExaminersIfNeeded();

    const adminPassword = getAdminPassword();
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get('includeHidden') === 'true';

    let query: Record<string, unknown> = { isPublished: true };
    if (includeHidden) {
      if (!adminPassword) {
        return NextResponse.json(
          { message: 'Admin password is not configured on the server.' },
          { status: 500 }
        );
      }

      const headerPassword = request.headers.get('x-admin-password') ?? '';
      if (!headerPassword || headerPassword !== adminPassword) {
        return NextResponse.json({ message: 'The password is incorrect.' }, { status: 401 });
      }
      query = {};
    }

    const examiners = await ExpertExaminer.find(query).sort(SORT_ORDER).lean();

    // 중복 제거: _id 기준으로 unique 처리
    const uniqueMap = new Map();
    examiners.forEach(examiner => {
      const id = examiner._id?.toString();
      if (id && !uniqueMap.has(id)) {
        uniqueMap.set(id, examiner);
      }
    });
    const uniqueExaminers = Array.from(uniqueMap.values());

    return NextResponse.json({ examiners: uniqueExaminers });
  } catch (error) {
    console.error('[expert-services/examiners][GET]', error);
    return NextResponse.json({ message: 'Failed to load examiner profiles.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) {
      return NextResponse.json(
        { message: 'Admin password is not configured on the server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      password,
      name,
      position,
      companyName,
      category,
      specialties,
      imageUrl,
      imageAlt,
      sortOrder,
      legacyKey,
      isPublished,
      headline,
      bio,
      profileHighlights,
      focusAreas,
      activityStats,
    } = body ?? {};

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: 'The password is incorrect.' }, { status: 401 });
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedPosition = typeof position === 'string' ? position.trim() : '';

    if (!trimmedName || !trimmedPosition) {
      return NextResponse.json({ message: 'Name and role are required fields.' }, { status: 400 });
    }

    await connectDB();

    const normalizedCategory = normalizeCategory(category);
    const incomingLegacy = typeof legacyKey === 'string' ? legacyKey.trim().toLowerCase() : '';
    const resolvedLegacyKey = incomingLegacy || slugify(trimmedName);
    const statsPayload = parseActivityStats(activityStats);

    const examiner = await ExpertExaminer.create({
      name: trimmedName,
      position: trimmedPosition,
      companyName: typeof companyName === 'string' ? companyName.trim() : '',
      category: normalizedCategory,
      specialties: parseSpecialties(specialties),
      imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
      imageAlt: typeof imageAlt === 'string' ? imageAlt.trim() : '',
      sortOrder: toNumberOrDefault(sortOrder, 0),
      legacyKey: resolvedLegacyKey,
      isPublished: typeof isPublished === 'boolean' ? isPublished : true,
      headline: typeof headline === 'string' ? headline.trim() : '',
      bio: typeof bio === 'string' ? bio.trim() : '',
      profileHighlights: parseStringList(profileHighlights),
      focusAreas: parseStringList(focusAreas),
      ...(statsPayload ? { activityStats: statsPayload } : {}),
    });

    return NextResponse.json({ examiner }, { status: 201 });
  } catch (error) {
    const duplicateResponse = handleDuplicateKeyError(error);
    if (duplicateResponse) {
      return duplicateResponse;
    }

    console.error('[expert-services/examiners][POST]', error);
    return NextResponse.json({ message: 'Failed to create examiner profile.' }, { status: 500 });
  }
}
