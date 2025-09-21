import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';

import connectDB from '@/lib/mongodb';
import ExpertExaminer from '@/models/ExpertExaminer';
import BusinessVoiceQuestion from '@/models/BusinessVoiceQuestion';

const MAX_RECENT_ANSWERS = 5;

const isValidObjectId = (value: string) => Types.ObjectId.isValid(value);

const createExcerpt = (content: string, limit = 160) => {
  const normalized = content.trim();
  if (normalized.length <= limit) {
    return normalized;
  }
  return `${normalized.slice(0, limit - 1)}…`;
};

const toIsoString = (value: unknown): string | null => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.valueOf()) ? null : value.toISOString();
  }
  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? null : date.toISOString();
  }
  return null;
};

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: 'Invalid examiner id.' }, { status: 400 });
  }

  try {
    await connectDB();

    const examiner = await ExpertExaminer.findById(id).lean();
    if (!examiner || examiner.isPublished === false) {
      return NextResponse.json({ message: 'Examiner profile was not found.' }, { status: 404 });
    }

    const objectId = new Types.ObjectId(id);

    const [statsDoc] = await BusinessVoiceQuestion.aggregate([
      { $match: { 'answers.profileId': objectId } },
      { $unwind: '$answers' },
      { $match: { 'answers.profileId': objectId } },
      {
        $group: {
          _id: null,
          totalAnswers: { $sum: 1 },
          helpfulCount: { $sum: { $ifNull: ['$answers.helpfulCount', 0] } },
          lastActiveAt: {
            $max: {
              $ifNull: ['$answers.answeredAt', '$updatedAt'],
            },
          },
          totalResponseMinutes: {
            $sum: {
              $divide: [
                {
                  $subtract: [{ $ifNull: ['$answers.answeredAt', '$updatedAt'] }, '$createdAt'],
                },
                1000 * 60,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalAnswers: 1,
          helpfulCount: 1,
          lastActiveAt: 1,
          averageResponseMinutes: {
            $cond: [
              { $gt: ['$totalAnswers', 0] },
              { $divide: ['$totalResponseMinutes', '$totalAnswers'] },
              null,
            ],
          },
        },
      },
    ]);

    const recentAnswerDocs = await BusinessVoiceQuestion.aggregate([
      { $match: { 'answers.profileId': objectId } },
      { $unwind: '$answers' },
      { $match: { 'answers.profileId': objectId } },
      {
        $addFields: {
          answeredAt: {
            $ifNull: ['$answers.answeredAt', '$updatedAt'],
          },
        },
      },
      { $sort: { answeredAt: -1, updatedAt: -1 } },
      { $limit: MAX_RECENT_ANSWERS },
      {
        $project: {
          _id: 0,
          questionId: '$_id',
          questionTitle: '$title',
          questionCategory: '$category',
          answeredAt: '$answeredAt',
          helpfulCount: { $ifNull: ['$answers.helpfulCount', 0] },
          role: '$answers.role',
          content: '$answers.content',
        },
      },
    ]);

    const fallbackStats = examiner.activityStats ?? {
      totalAnswers: 0,
      helpfulCount: 0,
      averageResponseMinutes: null,
      lastActiveAt: null,
    };

    const aggregatedStats = {
      totalAnswers: statsDoc?.totalAnswers ?? fallbackStats.totalAnswers ?? 0,
      helpfulCount: statsDoc?.helpfulCount ?? fallbackStats.helpfulCount ?? 0,
      averageResponseMinutes:
        typeof statsDoc?.averageResponseMinutes === 'number'
          ? Math.round(statsDoc.averageResponseMinutes * 10) / 10
          : (fallbackStats.averageResponseMinutes ?? null),
      lastActiveAt:
        toIsoString(statsDoc?.lastActiveAt) ?? toIsoString(fallbackStats.lastActiveAt) ?? null,
    } as const;

    const recentAnswers = recentAnswerDocs.map((entry) => ({
      questionId: entry.questionId?.toString() ?? '',
      questionTitle: entry.questionTitle,
      category: entry.questionCategory,
      answeredAt: toIsoString(entry.answeredAt),
      helpfulCount: entry.helpfulCount ?? 0,
      role: entry.role,
      excerpt: createExcerpt(entry.content ?? ''),
      content: entry.content ?? '',
    }));

    return NextResponse.json({
      profile: {
        id: examiner._id.toString(),
        name: examiner.name,
        position: examiner.position,
        companyName: examiner.companyName ?? '',
        headline: examiner.headline ?? '',
        bio: examiner.bio ?? '',
        specialties: examiner.specialties ?? [],
        focusAreas: examiner.focusAreas ?? [],
        profileHighlights: examiner.profileHighlights ?? [],
        activityStats: aggregatedStats,
      },
      recentAnswers,
    });
  } catch (error) {
    console.error('[expert-services/examiners/profile][GET]', error);
    return NextResponse.json({ message: 'Failed to load examiner profile.' }, { status: 500 });
  }
}
