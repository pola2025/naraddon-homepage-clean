
import crypto from 'crypto';
import { NextRequest } from 'next/server';

export const ACCESS_COOKIE = 'policy-analysis-access';

export const buildCookieValue = (password: string) =>
  crypto.createHash('sha256').update(password).digest('hex');

export function getAdminPasswordOrThrow() {
  const password = process.env.POLICY_ANALYSIS_PASSWORD;
  if (!password) {
    throw new Error('POLICY_ANALYSIS_PASSWORD is not configured.');
  }
  return password;
}

export function hasValidAccess(request: NextRequest, providedPassword?: string | null) {
  const adminPassword = getAdminPasswordOrThrow();
  const trimmedPassword = providedPassword?.trim();

  if (trimmedPassword) {
    return trimmedPassword === adminPassword;
  }

  return request.cookies.get(ACCESS_COOKIE)?.value === buildCookieValue(adminPassword);
}
