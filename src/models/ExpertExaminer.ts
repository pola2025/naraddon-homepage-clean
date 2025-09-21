import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ExaminerActivityStats {
  totalAnswers: number;
  helpfulCount: number;
  averageResponseMinutes: number | null;
  lastActiveAt: Date | null;
}

export interface IExpertExaminer extends Document {
  name: string;
  position: string;
  companyName?: string;
  category?: string;
  specialties: string[];
  imageUrl?: string;
  imageAlt?: string;
  sortOrder: number;
  legacyKey?: string;
  isPublished: boolean;
  headline?: string;
  bio?: string;
  profileHighlights: string[];
  focusAreas: string[];
  activityStats: ExaminerActivityStats;
  createdAt: Date;
  updatedAt: Date;
}

const toUniqueStringArray = (values: unknown): string[] => {
  if (typeof values === 'string') {
    return values
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
  }

  if (!Array.isArray(values)) {
    return [];
  }

  const normalized = values
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value): value is string => Boolean(value));

  return Array.from(new Set(normalized));
};

const expertExaminerSchema = new Schema<IExpertExaminer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'funding',
    },
    specialties: {
      type: [String],
      default: [],
      set: toUniqueStringArray,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imageAlt: {
      type: String,
      trim: true,
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    legacyKey: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    profileHighlights: {
      type: [String],
      default: [],
      set: toUniqueStringArray,
    },
    focusAreas: {
      type: [String],
      default: [],
      set: toUniqueStringArray,
    },
    activityStats: {
      totalAnswers: { type: Number, default: 0, min: 0 },
      helpfulCount: { type: Number, default: 0, min: 0 },
      averageResponseMinutes: { type: Number, default: null },
      lastActiveAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

expertExaminerSchema.index({ sortOrder: 1, createdAt: -1 });
expertExaminerSchema.index({ isPublished: 1 });
expertExaminerSchema.index({ category: 1, sortOrder: 1, createdAt: -1 });
expertExaminerSchema.index({ legacyKey: 1 }, { unique: true, sparse: true });

const ExpertExaminer: Model<IExpertExaminer> =
  mongoose.models.ExpertExaminer ||
  mongoose.model<IExpertExaminer>('ExpertExaminer', expertExaminerSchema);

export default ExpertExaminer;
