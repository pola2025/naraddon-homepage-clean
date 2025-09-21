import mongoose, { Document, Model, Schema } from 'mongoose';

export type BusinessVoiceAnswerRole = 'community' | 'expert' | 'examiner' | 'consultant';

export interface BusinessVoiceSource {
  title: string;
  publisher: string;
  url: string;
  publishedAt: string;
}

export interface BusinessVoiceAnswer {
  role: BusinessVoiceAnswerRole;
  displayName: string;
  headline?: string;
  title?: string;
  organization?: string;
  content: string;
  isPinned: boolean;
  sources?: BusinessVoiceSource[];
  helpfulCount?: number;
  profileId?: mongoose.Types.ObjectId | string | null;
  answeredAt?: Date;
}

export interface BusinessVoiceAuthor {
  nickname: string;
  businessType: string;
  region: string;
  yearsInBusiness?: number | null;
}

export interface BusinessVoiceMetrics {
  viewCount: number;
  commentCount: number;
  scrapCount: number;
}

export interface BusinessVoiceFlags {
  needsExpertReply: boolean;
  needsExaminerReply: boolean;
}

export interface IBusinessVoiceQuestion extends Document {
  title: string;
  content: string;
  category: string;
  author: BusinessVoiceAuthor;
  metrics: BusinessVoiceMetrics;
  flags: BusinessVoiceFlags;
  sources: BusinessVoiceSource[];
  answers: BusinessVoiceAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const sourceSchema = new Schema<BusinessVoiceSource>(
  {
    title: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    publishedAt: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const answerSchema = new Schema<BusinessVoiceAnswer>(
  {
    role: {
      type: String,
      required: true,
      enum: ['community', 'expert', 'examiner', 'consultant'],
    },
    displayName: { type: String, required: true, trim: true },
    headline: { type: String, trim: true },
    title: { type: String, trim: true },
    organization: { type: String, trim: true },
    content: { type: String, required: true, trim: true },
    isPinned: { type: Boolean, default: false },
    sources: { type: [sourceSchema], default: undefined },
    helpfulCount: { type: Number, default: 0, min: 0 },
    profileId: { type: Schema.Types.ObjectId, ref: 'ExpertExaminer', default: null },
    answeredAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const questionSchema = new Schema<IBusinessVoiceQuestion>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    author: {
      nickname: { type: String, required: true, trim: true },
      businessType: { type: String, required: true, trim: true },
      region: { type: String, required: true, trim: true },
      yearsInBusiness: { type: Number, min: 0, max: 200, default: null },
    },
    metrics: {
      viewCount: { type: Number, default: 0, min: 0 },
      commentCount: { type: Number, default: 0, min: 0 },
      scrapCount: { type: Number, default: 0, min: 0 },
    },
    flags: {
      needsExpertReply: { type: Boolean, default: false },
      needsExaminerReply: { type: Boolean, default: false },
    },
    sources: { type: [sourceSchema], default: [] },
    answers: { type: [answerSchema], default: [] },
  },
  { timestamps: true }
);

questionSchema.index({ category: 1, 'metrics.viewCount': -1, createdAt: -1 });
questionSchema.index({ 'flags.needsExpertReply': 1, createdAt: -1 });
questionSchema.index({ 'answers.profileId': 1, updatedAt: -1 });

const BusinessVoiceQuestion: Model<IBusinessVoiceQuestion> =
  mongoose.models.BusinessVoiceQuestion ||
  mongoose.model<IBusinessVoiceQuestion>('BusinessVoiceQuestion', questionSchema);

export default BusinessVoiceQuestion;
