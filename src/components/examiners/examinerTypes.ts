export type ExaminerActivityStats = {
  totalAnswers: number;
  helpfulCount: number;
  averageResponseMinutes?: number | null;
  lastActiveAt?: string | null;
};

export type ExaminerProfile = {
  _id?: string;
  name: string;
  position: string;
  companyName?: string;
  category?: string;
  specialties?: string[];
  imageUrl?: string;
  imageAlt?: string;
  sortOrder?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  legacyKey?: string;
  headline?: string;
  bio?: string;
  profileHighlights?: string[];
  focusAreas?: string[];
  activityStats?: ExaminerActivityStats;
};

export type ExaminerFormInput = {
  _id?: string;
  name: string;
  position: string;
  companyName: string;
  category: string;
  specialties: string;
  imageUrl: string;
  imageAlt: string;
  sortOrder: number;
  isPublished: boolean;
  legacyKey: string;
  headline?: string;
  bio?: string;
  profileHighlights?: string;
  focusAreas?: string;
};

export type FeedbackState = { type: 'success' | 'error'; text: string } | null;

export type ExaminerAdminPanelHandle = {
  openModal: () => void;
};
