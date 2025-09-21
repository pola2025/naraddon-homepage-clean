import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import connectDB from '@/lib/mongodb';
import ExpertExaminer from '@/models/ExpertExaminer';

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

const ensureValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) {
      return NextResponse.json(
        { message: 'Admin password is not configured on the server.' },
        { status: 500 }
      );
    }

    const { id } = params;
    if (!ensureValidId(id)) {
      return NextResponse.json({ message: 'Invalid examiner id.' }, { status: 400 });
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

    const update: Record<string, unknown> = {
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
    };

    if (statsPayload) {
      update.activityStats = statsPayload;
    }

    const examiner = await ExpertExaminer.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!examiner) {
      return NextResponse.json({ message: 'Examiner profile was not found.' }, { status: 404 });
    }

    return NextResponse.json({ examiner });
  } catch (error) {
    const duplicateResponse = handleDuplicateKeyError(error);
    if (duplicateResponse) {
      return duplicateResponse;
    }

    console.error('[expert-services/examiners][PUT]', error);
    return NextResponse.json({ message: 'Failed to update examiner profile.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminPassword = getAdminPassword();
    if (!adminPassword) {
      return NextResponse.json(
        { message: 'Admin password is not configured on the server.' },
        { status: 500 }
      );
    }

    const { id } = params;
    if (!ensureValidId(id)) {
      return NextResponse.json({ message: 'Invalid examiner id.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body as { password?: string };

    if (!password || password !== adminPassword) {
      return NextResponse.json({ message: 'The password is incorrect.' }, { status: 401 });
    }

    await connectDB();

    const result = await ExpertExaminer.findByIdAndDelete(id).lean();
    if (!result) {
      return NextResponse.json({ message: 'Examiner profile was not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[expert-services/examiners][DELETE]', error);
    return NextResponse.json({ message: 'Failed to delete examiner profile.' }, { status: 500 });
  }
}
