// 사업자 목소리 페이지 타입 정의
export interface VoiceData {
  id: string;
  author: string;
  company: string;
  rating: number;
  content: string;
  date: string;
  tags: string[];
  verified: boolean;
  helpful: number;
  images?: string[];
  category: string;
}

export interface StatData {
  id: string;
  label: string;
  value: string;
  icon: string;
}

export interface Category {
  id: string;
  label: string;
  count: number;
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  company: string;
  position: string;
  image?: string;
}
