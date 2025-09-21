import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBusinessVoiceInterviewVideo extends Document {
  youtubeUrl: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  author?: string;
  company?: string;
  amount?: string;
  views?: number;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessVoiceInterviewVideoSchema = new Schema<IBusinessVoiceInterviewVideo>(
  {
    youtubeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    amount: {
      type: String,
      trim: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// YouTube ID 추출 헬퍼 메서드
BusinessVoiceInterviewVideoSchema.methods.getYouTubeId = function() {
  const url = this.youtubeUrl;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// YouTube 썸네일 URL 가져오기
BusinessVoiceInterviewVideoSchema.methods.getYouTubeThumbnail = function() {
  const videoId = this.getYouTubeId();
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// 표시할 썸네일 URL 가져오기 (커스텀 썸네일 우선)
BusinessVoiceInterviewVideoSchema.methods.getDisplayThumbnail = function() {
  return this.thumbnailUrl || this.getYouTubeThumbnail();
};

const BusinessVoiceInterviewVideo: Model<IBusinessVoiceInterviewVideo> =
  mongoose.models.BusinessVoiceInterviewVideo ||
  mongoose.model<IBusinessVoiceInterviewVideo>('BusinessVoiceInterviewVideo', BusinessVoiceInterviewVideoSchema);

export default BusinessVoiceInterviewVideo;