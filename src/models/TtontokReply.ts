import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export type TtontokReplyRole = 'general' | 'certified_examiner' | 'expert';

export interface ITtontokReply extends Document {
  postId: Types.ObjectId;
  content: string;
  nickname: string;
  memberId?: Types.ObjectId | null;
  role: TtontokReplyRole;
  isAccepted: boolean;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TtontokReplySchema = new Schema<ITtontokReply>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'TtontokPost',
      required: true,
      index: true,
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
    role: {
      type: String,
      enum: ['general', 'certified_examiner', 'expert'],
      default: 'general',
      index: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
      index: true,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

TtontokReplySchema.index({ postId: 1, createdAt: 1 });

const TtontokReply: Model<ITtontokReply> =
  mongoose.models.TtontokReply || mongoose.model<ITtontokReply>('TtontokReply', TtontokReplySchema);

export default TtontokReply;
