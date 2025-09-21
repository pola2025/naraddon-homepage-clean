import { Schema, model, models } from 'mongoose';

export interface IConsultationRequest {
  _id: Schema.Types.ObjectId;
  name: string;
  phone: string;
  region: string;
  desiredTime: string;
  consultType: string;
  annualRevenue: string;
  employeeCount: string;
  preferredTime: string;
  businessNumber?: string;
  email?: string;
  message?: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
  meta?: {
    ip?: string;
    forwardedFor?: string;
    userAgent?: string;
    referer?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationRequestSchema = new Schema<IConsultationRequest>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    desiredTime: { type: String, required: true, trim: true },
    consultType: { type: String, required: true, trim: true },
    annualRevenue: { type: String, required: true, trim: true },
    employeeCount: { type: String, required: true, trim: true },
    preferredTime: { type: String, required: true, trim: true },
    businessNumber: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    message: { type: String, default: '', trim: true },
    privacyConsent: { type: Boolean, required: true },
    marketingConsent: { type: Boolean, default: false },
    meta: {
      ip: { type: String, default: '', trim: true },
      forwardedFor: { type: String, default: '', trim: true },
      userAgent: { type: String, default: '', trim: true },
      referer: { type: String, default: '', trim: true },
    },
  },
  { timestamps: true }
);

ConsultationRequestSchema.index({ createdAt: -1 });

const ConsultationRequest =
  models.ConsultationRequest || model('ConsultationRequest', ConsultationRequestSchema);

export default ConsultationRequest;
