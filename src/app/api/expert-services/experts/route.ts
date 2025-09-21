import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';
import ExpertExaminer from '@/models/ExpertExaminer';
import type { ExaminerProfile } from '@/components/examiners/examinerTypes';
import { VERIFIED_EXPERT_PROFILES as VERIFIED_EXPERT_PROFILES_DATA } from '@/data/expertsShowcase';

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

type RawExpert = (ExaminerProfile & {
  _id?: string | { toString: () => string };
  id?: string;
  headline?: string;
  bio?: string;
  profileHighlights?: string[];
  focusAreas?: string[];
  activityStats?: Record<string, unknown> | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}) & Record<string, unknown>;

type ExpertProfileResponse = ExaminerProfile & {
  id: string;
  headline?: string;
  bio?: string;
  profileHighlights?: string[];
  focusAreas?: string[];
  activityStats?: Record<string, unknown> | null;
  verifiedAt?: string | null;
};

const getNumberFromParam = (value: string | null, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return parsed;
};

const parseCategories = (value: string | null): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

const toIsoString = (value: unknown): string | null => {
  if (!value) return null;
  if (value instanceof Date) {
    return Number.isNaN(value.valueOf()) ? null : value.toISOString();
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? null : date.toISOString();
  }
  return null;
};

const normalizeImageUrl = (
  imageUrl: string | undefined,
  legacyKey: string | undefined,
  name: string
) => {
  if (typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
    return imageUrl.trim();
  }
  if (legacyKey && legacyKey.trim().length > 0) {
    return `/images/examiners/${legacyKey.trim()}.png`;
  }
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return slug ? `/images/examiners/${slug}.png` : '';
};

const normalizeActivityStats = (stats: Record<string, unknown> | null | undefined) => {
  if (!stats) return null;
  const clone: Record<string, unknown> = { ...stats };
  if ('lastActiveAt' in clone) {
    clone.lastActiveAt = toIsoString(clone.lastActiveAt) ?? clone.lastActiveAt;
  }
  if ('averageResponseMinutes' in clone && typeof clone.averageResponseMinutes === 'number') {
    const value = clone.averageResponseMinutes as number;
    clone.averageResponseMinutes = Math.round(value * 10) / 10;
  }
  return clone;
};

const mapExaminerToExpertProfile = (
  examiner: RawExpert,
  index = 0
): ExpertProfileResponse => {
  const legacyKey =
    typeof examiner.legacyKey === 'string' && examiner.legacyKey.trim().length > 0
      ? examiner.legacyKey.trim()
      : undefined;
  const name = typeof examiner.name === 'string' ? examiner.name : '';
  const imageUrl = normalizeImageUrl(examiner.imageUrl as string | undefined, legacyKey, name);
  const id =
    (typeof examiner.id === 'string' && examiner.id.trim()) ||
    (typeof examiner._id === 'string' && examiner._id.trim()) ||
    (examiner._id && typeof examiner._id === 'object' && 'toString' in examiner._id
      ? examiner._id.toString()
      : undefined) ||
    legacyKey ||
    name;

  const imageAlt =
    typeof examiner.imageAlt === 'string' && examiner.imageAlt.trim().length > 0
      ? examiner.imageAlt.trim()
      : `${name} 전문가`;

  return {
    id,
    name,
    position: typeof examiner.position === 'string' ? examiner.position : '',
    companyName: typeof examiner.companyName === 'string' ? examiner.companyName : '',
    category: typeof examiner.category === 'string' ? examiner.category : 'expert',
    specialties: Array.isArray(examiner.specialties) ? examiner.specialties : [],
    imageUrl,
    imageAlt,
    sortOrder: typeof examiner.sortOrder === 'number' ? examiner.sortOrder : index,
    headline: typeof examiner.headline === 'string' ? examiner.headline : undefined,
    bio: typeof examiner.bio === 'string' ? examiner.bio : undefined,
    profileHighlights: Array.isArray(examiner.profileHighlights)
      ? examiner.profileHighlights
      : undefined,
    focusAreas: Array.isArray(examiner.focusAreas) ? examiner.focusAreas : undefined,
    activityStats: normalizeActivityStats(examiner.activityStats ?? null),
    verifiedAt: toIsoString(examiner.updatedAt ?? examiner.createdAt),
    legacyKey: legacyKey ?? id,
    imageAlt: typeof examiner.imageAlt === 'string' && examiner.imageAlt.trim().length > 0
      ? examiner.imageAlt.trim()
      : `${name} 전문가`,
  } as ExpertProfileResponse;
};

const mapVerifiedProfile = (profile: ExaminerProfile, index: number): ExpertProfileResponse =>
  mapExaminerToExpertProfile(
    {
      ...profile,
      _id: profile._id ?? profile.legacyKey ?? profile.name,
      id: profile._id ?? profile.legacyKey ?? profile.name,
    },
    index
  );

const buildFallbackProfiles = (): ExpertProfileResponse[] =>
  VERIFIED_EXPERT_PROFILES_DATA.map((profile, index) => mapVerifiedProfile(profile, index));

const mergeExpertLists = (
  primary: ExpertProfileResponse[],
  fallback: ExpertProfileResponse[],
  limit: number
): ExpertProfileResponse[] => {
  const seen = new Set<string>();
  const result: ExpertProfileResponse[] = [];
  for (const entry of [...primary, ...fallback]) {
    const key = entry.id ?? entry.legacyKey ?? entry.name;
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entry);
    if (result.length >= limit) break;
  }
  return result;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limitParam = Math.min(
    getNumberFromParam(searchParams.get('limit'), DEFAULT_LIMIT),
    MAX_LIMIT
  );
  const categories = parseCategories(searchParams.get('category'));
  const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

  try {
    await connectDB();

    const filter: Record<string, unknown> = {};
    if (!includeUnpublished) {
      filter.isPublished = true;
    }
    if (categories.length > 0) {
      filter.category = { $in: categories };
    }

    const experts = await ExpertExaminer.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limitParam)
      .lean<RawExpert[]>();

    const mappedExperts = experts.map((examiner, index) => mapExaminerToExpertProfile(examiner, index));
    const fallbackExperts = buildFallbackProfiles();
    const payload = mergeExpertLists(mappedExperts, fallbackExperts, limitParam);

    return NextResponse.json({ experts: payload });
  } catch (error) {
    console.error('[expert-services/experts][GET]', error);
    const fallbackExperts = buildFallbackProfiles().slice(0, limitParam);
    return NextResponse.json({ experts: fallbackExperts });
  }
}
