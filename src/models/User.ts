import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone: string;
  profileImage?: string | null;
  role: 'admin' | 'examiner' | 'company';
  isActive: boolean;

  examinerInfo?: {
    activeRegions: string[];
    specialties: string[];
    website?: string | null;
  };

  companyInfo?: {
    businessNumber?: string;
    companyName?: string;
    region?: string;
  };

  permissions: {
    canAccessDashboard: boolean;
    canWritePosts: boolean;
    canViewBlacklist: boolean;
    canWriteComments: boolean;
    canWriteInquiries: boolean;
  };

  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
  toPublicJSON(): Record<string, unknown>;
  displayName: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['admin', 'examiner', 'company'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  examinerInfo: {
    activeRegions: [
      {
        type: String,
      },
    ],
    specialties: [
      {
        type: String,
      },
    ],
    website: {
      type: String,
      default: null,
    },
  },

  companyInfo: {
    businessNumber: {
      type: String,
      sparse: true,
    },
    companyName: {
      type: String,
    },
    region: {
      type: String,
    },
  },

  permissions: {
    canAccessDashboard: {
      type: Boolean,
      default: false,
    },
    canWritePosts: {
      type: Boolean,
      default: false,
    },
    canViewBlacklist: {
      type: Boolean,
      default: false,
    },
    canWriteComments: {
      type: Boolean,
      default: false,
    },
    canWriteInquiries: {
      type: Boolean,
      default: false,
    },
  },

  lastLogin: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.pre('save', function (next) {
  switch (this.role) {
    case 'admin':
      this.permissions = {
        canAccessDashboard: true,
        canWritePosts: true,
        canViewBlacklist: true,
        canWriteComments: true,
        canWriteInquiries: true,
      };
      break;
    case 'examiner':
      this.permissions = {
        canAccessDashboard: false,
        canWritePosts: true,
        canViewBlacklist: true,
        canWriteComments: true,
        canWriteInquiries: true,
      };
      break;
    case 'company':
      this.permissions = {
        canAccessDashboard: false,
        canWritePosts: false,
        canViewBlacklist: false,
        canWriteComments: true,
        canWriteInquiries: true,
      };
      break;
  }
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;

  if (this.role !== 'examiner') {
    delete obj.examinerInfo;
  }
  if (this.role !== 'company') {
    delete obj.companyInfo;
  }

  return obj;
};

userSchema.virtual('displayName').get(function () {
  if (this.role === 'company' && this.companyInfo?.companyName) {
    return `${this.companyInfo.companyName} (${this.name})`;
  }
  return this.name;
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'companyInfo.businessNumber': 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
