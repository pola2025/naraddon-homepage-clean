import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPolicyNewsPost extends Document {
  title: string;
  content: string;
  category?: string;
  excerpt?: string;
  thumbnail?: string;
  tags: string[];
  isMain: boolean;
  isPinned: boolean;
  badge?: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

const policyNewsSchema = new Schema<IPolicyNewsPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: '기타',
      trim: true,
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isMain: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

policyNewsSchema.index({ createdAt: -1 });
policyNewsSchema.index({ isMain: 1, isPinned: 1 });

const PolicyNewsPost: Model<IPolicyNewsPost> =
  mongoose.models.PolicyNewsPost ||
  mongoose.model<IPolicyNewsPost>('PolicyNewsPost', policyNewsSchema);

export default PolicyNewsPost;
