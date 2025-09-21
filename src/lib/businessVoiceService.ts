import type { FilterQuery } from 'mongoose';

import BusinessVoiceQuestion, {
  BusinessVoiceAnswer,
  BusinessVoiceAnswerRole,
  BusinessVoiceSource,
  IBusinessVoiceQuestion,
} from '@/models/BusinessVoiceQuestion';
import connectDB from '@/lib/mongodb';

export interface GetBusinessVoiceOptions {
  category?: string | null;
  limit?: number;
  needsExpertReply?: boolean | null;
}

export interface BusinessVoiceAnswerDto {
  role: BusinessVoiceAnswerRole;
  displayName: string;
  headline?: string;
  title?: string;
  organization?: string;
  content: string;
  isPinned: boolean;
  sources: BusinessVoiceSource[];
  helpfulCount: number;
  profileId?: string;
  answeredAt?: string;
}

export interface BusinessVoiceQuestionDto {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    nickname: string;
    businessType: string;
    region: string;
    yearsInBusiness: number | null;
  };
  metrics: {
    viewCount: number;
    commentCount: number;
    scrapCount: number;
  };
  flags: {
    needsExpertReply: boolean;
    needsExaminerReply: boolean;
  };
  sources: BusinessVoiceSource[];
  answers: BusinessVoiceAnswerDto[];
  createdAt: string;
  updatedAt: string;
}

const ROLE_PRIORITY: Record<BusinessVoiceAnswerRole, number> = {
  expert: 0,
  examiner: 1,
  consultant: 2,
  community: 3,
};

const serializeAnswer = (answer: BusinessVoiceAnswer): BusinessVoiceAnswerDto => {
  const profileIdValue = (answer as { profileId?: unknown }).profileId;
  const answeredAtValue = (answer as { answeredAt?: unknown }).answeredAt;
  const helpfulCountValue = (answer as { helpfulCount?: unknown }).helpfulCount;

  let profileId: string | undefined;
  if (typeof profileIdValue === 'string') {
    profileId = profileIdValue;
  } else if (
    profileIdValue &&
    typeof (profileIdValue as { toString?: () => string }).toString === 'function'
  ) {
    profileId = (profileIdValue as { toString: () => string }).toString();
  }

  let answeredAt: string | undefined;
  if (typeof answeredAtValue === 'string') {
    answeredAt = new Date(answeredAtValue).toISOString();
  } else if (answeredAtValue instanceof Date) {
    answeredAt = answeredAtValue.toISOString();
  }

  const helpfulCount =
    typeof helpfulCountValue === 'number' && Number.isFinite(helpfulCountValue)
      ? helpfulCountValue
      : 0;

  return {
    role: answer.role,
    displayName: answer.displayName,
    headline: answer.headline,
    title: answer.title,
    organization: answer.organization,
    content: answer.content,
    isPinned: Boolean(answer.isPinned),
    sources: answer.sources ?? [],
    helpfulCount,
    profileId,
    answeredAt,
  };
};

const sortAnswers = (answers: BusinessVoiceAnswerDto[]): BusinessVoiceAnswerDto[] => {
  return [...answers].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return ROLE_PRIORITY[a.role] - ROLE_PRIORITY[b.role];
  });
};

export async function getBusinessVoiceQuestions(
  options: GetBusinessVoiceOptions = {}
): Promise<BusinessVoiceQuestionDto[]> {
  const { category, limit = 20, needsExpertReply } = options;
  await connectDB();

  const filter: FilterQuery<IBusinessVoiceQuestion> = {};
  if (category) {
    filter.category = category.toLowerCase();
  }
  if (typeof needsExpertReply === 'boolean') {
    filter['flags.needsExpertReply'] = needsExpertReply;
  }

  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const docs = await BusinessVoiceQuestion.find(filter)
    .sort({ 'metrics.viewCount': -1, createdAt: -1 })
    .limit(safeLimit)
    .lean<IBusinessVoiceQuestion[]>();

  return docs.map((doc) => {
    const answers = sortAnswers((doc.answers ?? []).map(serializeAnswer));

    return {
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      category: doc.category,
      author: {
        nickname: doc.author.nickname,
        businessType: doc.author.businessType,
        region: doc.author.region,
        yearsInBusiness:
          typeof doc.author.yearsInBusiness === 'number' ? doc.author.yearsInBusiness : null,
      },
      metrics: {
        viewCount: doc.metrics?.viewCount ?? 0,
        commentCount: doc.metrics?.commentCount ?? 0,
        scrapCount: doc.metrics?.scrapCount ?? 0,
      },
      flags: {
        needsExpertReply: doc.flags?.needsExpertReply ?? false,
        needsExaminerReply: doc.flags?.needsExaminerReply ?? false,
      },
      sources: doc.sources ?? [],
      answers,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  });
}
