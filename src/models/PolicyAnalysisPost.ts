import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPolicyAnalysisSection {
  id: string;
  title: string;
  content: string;
}

export interface IPolicyAnalysisImage {
  url: string;
  name?: string;
  caption?: string;
}

export interface IPolicyAnalysisAttachment {
  key: string;
  fileName: string;
  mimeType: string;
  size: number;
  sourceUrl?: string;
  cdnUrl?: string;
  checksum?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface IPolicyAnalysisExaminer {
  key: string;
  name: string;
  companyName: string;
}

export interface IPolicyAnalysisPost extends Document {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  isStructured: boolean;
  sections: IPolicyAnalysisSection[];
  tags: string[];
  thumbnail?: string;
  images: IPolicyAnalysisImage[];
  attachments: IPolicyAnalysisAttachment[];
  examiner: IPolicyAnalysisExaminer;
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

const sectionSchema = new Schema<IPolicyAnalysisSection>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const imageSchema = new Schema<IPolicyAnalysisImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const attachmentSchema = new Schema<IPolicyAnalysisAttachment>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    cdnUrl: {
      type: String,
      default: '',
      trim: true,
    },
    checksum: {
      type: String,
      default: '',
      trim: true,
    },
    uploadedBy: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedAt: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const examinerSchema = new Schema<IPolicyAnalysisExaminer>(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const policyAnalysisSchema = new Schema<IPolicyAnalysisPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
    content: {
      type: String,
      required: true,
    },
    isStructured: {
      type: Boolean,
      default: true,
    },
    sections: {
      type: [sectionSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    examiner: {
      type: examinerSchema,
      required: true,
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

policyAnalysisSchema.index({ createdAt: -1 });
policyAnalysisSchema.index({ category: 1, createdAt: -1 });
policyAnalysisSchema.index({ 'examiner.key': 1 });

const PolicyAnalysisPost: Model<IPolicyAnalysisPost> =
  mongoose.models.PolicyAnalysisPost ||
  mongoose.model<IPolicyAnalysisPost>('PolicyAnalysisPost', policyAnalysisSchema);

export default PolicyAnalysisPost;
