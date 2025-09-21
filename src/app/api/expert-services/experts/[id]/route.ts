import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

import connectDB from '@/lib/mongodb';
import ExpertExaminer from '@/models/ExpertExaminer';
import { VERIFIED_EXPERT_PROFILES as VERIFIED_EXPERT_PROFILES_DATA } from '@/data/expertsShowcase';

const isValidObjectId = (value: string) => mongoose.Types.ObjectId.isValid(value);

const normalizeImageUrl = (imageUrl: string | undefined, legacyKey: string | undefined, name: string) => {
  if (typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
    return imageUrl.trim();
  }
  if (legacyKey && legacyKey.trim().length > 0) {
    return `/images/examiners/${legacyKey.trim()}.png`;
  }
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return slug ? `/images/examiners/${slug}.png` : '';
};

const mapExaminerToExpertProfile = (examiner: any) => {
  const legacyKey = typeof examiner.legacyKey === 'string' ? examiner.legacyKey : undefined;
  const imageUrl = normalizeImageUrl(examiner.imageUrl, legacyKey, examiner.name ?? '');

  return {
    id: examiner._id?.toString() ?? legacyKey ?? examiner.name,
    name: examiner.name,
    position: examiner.position,
    companyName: examiner.companyName ?? '',
    category: examiner.category ?? 'expert',
    specialties: Array.isArray(examiner.specialties) ? examiner.specialties : [],
    imageUrl,
    imageAlt:
      typeof examiner.imageAlt === 'string' && examiner.imageAlt.trim().length > 0
        ? examiner.imageAlt.trim()
        : `${examiner.name} 전문가`,
    sortOrder: typeof examiner.sortOrder === 'number' ? examiner.sortOrder : 0,
    headline: examiner.headline ?? '',
    bio: examiner.bio ?? '',
    profileHighlights: Array.isArray(examiner.profileHighlights) ? examiner.profileHighlights : [],
    focusAreas: Array.isArray(examiner.focusAreas) ? examiner.focusAreas : [],
    activityStats: examiner.activityStats ?? null,
    verifiedAt: examiner.updatedAt ?? examiner.createdAt ?? null,
  };
};

const findFallbackExpert = (id: string) => {
  const lowerId = id.toLowerCase();
  return VERIFIED_EXPERT_PROFILES_DATA.find((profile) => {
    const possibleIds = [
      profile._id,
      profile.legacyKey,
      profile.name,
      profile.companyName,
    ]
      .filter(Boolean)
      .map((value) => value!.toString().toLowerCase());
    return possibleIds.includes(lowerId);
  });
};

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connectDB();

    let examiner;

    if (isValidObjectId(id)) {
      examiner = await ExpertExaminer.findById(id).lean();
    }

    if (!examiner) {
      examiner = await ExpertExaminer.findOne({ legacyKey: id.toLowerCase() }).lean();
    }

    if (examiner && examiner.isPublished === false) {
      examiner = null;
    }

    if (examiner) {
      return NextResponse.json({ expert: mapExaminerToExpertProfile(examiner) });
    }

    const fallback = findFallbackExpert(id);
    if (fallback) {
      return NextResponse.json({ expert: mapExaminerToExpertProfile(fallback) });
    }

    return NextResponse.json({ message: 'Expert profile was not found.' }, { status: 404 });
  } catch (error) {
    console.error('[expert-services/experts][GET id]', error);
    const fallback = findFallbackExpert(id);
    if (fallback) {
      return NextResponse.json({ expert: mapExaminerToExpertProfile(fallback) });
    }
    return NextResponse.json({ message: 'Failed to load expert profile.' }, { status: 500 });
  }
}
