import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type TtontokCategory =
  | 'funding'
  | 'tax'
  | 'hr'
  | 'marketing'
  | 'strategy'
  | 'tech'
  | 'legal'
  | 'etc';

export interface ITtontokPost extends Document {
  title: string;
  category: TtontokCategory;
  content: string;
  nickname: string;
  memberId?: Types.ObjectId | null;
  tags: string[];
  viewCount: number;
  likeCount: number;
  replyCount: number;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TtontokPostSchema = new Schema<ITtontokPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      enum: ['funding', 'tax', 'hr', 'marketing', 'strategy', 'tech', 'legal', 'etc'],
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      set: (values: unknown) => {
        if (!Array.isArray(values)) {
          return [];
        }
        const normalized = values
          .map((value) => (typeof value === 'string' ? value.trim() : ''))
          .filter((value) => value.length > 0);
        return Array.from(new Set(normalized));
      },
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

TtontokPostSchema.index({ createdAt: -1 });
TtontokPostSchema.index({ category: 1, createdAt: -1 });
TtontokPostSchema.index({ viewCount: -1 });
TtontokPostSchema.index({ likeCount: -1 });

const TtontokPost: Model<ITtontokPost> =
  mongoose.models.TtontokPost || mongoose.model<ITtontokPost>('TtontokPost', TtontokPostSchema);

export default TtontokPost;
