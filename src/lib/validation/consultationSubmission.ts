export interface ConsultationSubmissionInput {
  name?: unknown;
  phone?: unknown;
  region?: unknown;
  desiredTime?: unknown;
  consultType?: unknown;
  annualRevenue?: unknown;
  employeeCount?: unknown;
  preferredTime?: unknown;
  businessNumber?: unknown;
  email?: unknown;
  message?: unknown;
  privacyConsent?: unknown;
  marketingConsent?: unknown;
}

export interface ConsultationSubmission {
  name: string;
  phone: string;
  region: string;
  desiredTime: string;
  consultType: string;
  annualRevenue: string;
  employeeCount: string;
  preferredTime: string;
  businessNumber: string;
  email: string;
  message: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}

export interface ConsultationValidationResult {
  data?: ConsultationSubmission;
  errors: Record<string, string>;
}

const REQUIRED_STRING_FIELDS: Array<keyof ConsultationSubmission> = [
  'name',
  'phone',
  'region',
  'desiredTime',
  'consultType',
  'annualRevenue',
  'employeeCount',
  'preferredTime',
];

const OPTIONAL_STRING_FIELDS: Array<keyof ConsultationSubmission> = [
  'businessNumber',
  'email',
  'message',
];

const MAX_MESSAGE_LENGTH = 600;

function normalizeString(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }
  return '';
}

export function validateConsultationSubmission(
  input: ConsultationSubmissionInput
): ConsultationValidationResult {
  const errors: Record<string, string> = {};
  const result: ConsultationSubmission = {
    name: '',
    phone: '',
    region: '',
    desiredTime: '',
    consultType: '',
    annualRevenue: '',
    employeeCount: '',
    preferredTime: '',
    businessNumber: '',
    email: '',
    message: '',
    privacyConsent: false,
    marketingConsent: false,
  };

  for (const field of REQUIRED_STRING_FIELDS) {
    const value = normalizeString(input[field]);
    if (!value) {
      errors[field] = '이 필드는 필수입니다.';
    } else {
      result[field] = value;
    }
  }

  for (const field of OPTIONAL_STRING_FIELDS) {
    const value = normalizeString(input[field]);
    result[field] = value;
  }

  if (result.message.length > MAX_MESSAGE_LENGTH) {
    errors.message = `문의사항은 최대 ${MAX_MESSAGE_LENGTH}자까지 입력 가능합니다.`;
    result.message = result.message.slice(0, MAX_MESSAGE_LENGTH);
  }

  const privacyConsent = Boolean(input.privacyConsent);
  if (!privacyConsent) {
    errors.privacyConsent = '개인정보 수집 및 이용에 동의해 주세요.';
  }

  result.privacyConsent = privacyConsent;
  result.marketingConsent = Boolean(input.marketingConsent);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return { data: result, errors };
}
