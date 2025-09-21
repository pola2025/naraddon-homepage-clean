import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INaraddonTubeVideo {
  title: string;
  youtubeId: string;
  url: string;
  customThumbnail?: string;
}

export interface INaraddonTubeEntry extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  thumbnailUrl: string;
  videos: INaraddonTubeVideo[];
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const naraddonTubeVideoSchema = new Schema<INaraddonTubeVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    youtubeId: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    customThumbnail: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const naraddonTubeEntrySchema = new Schema<INaraddonTubeEntry>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    videos: {
      type: [naraddonTubeVideoSchema],
      validate: {
        validator: (videos: INaraddonTubeVideo[]) => Array.isArray(videos) && videos.length === 2,
        message: '영상 링크는 반드시 2개여야 합니다.',
      },
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

naraddonTubeEntrySchema.index({ sortOrder: 1, createdAt: -1 });
naraddonTubeEntrySchema.index({ isPublished: 1 });

const NaraddonTubeEntry: Model<INaraddonTubeEntry> =
  mongoose.models.NaraddonTubeEntry ||
  mongoose.model<INaraddonTubeEntry>('NaraddonTubeEntry', naraddonTubeEntrySchema);

export default NaraddonTubeEntry;
