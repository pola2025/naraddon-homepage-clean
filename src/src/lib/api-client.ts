import axios, { AxiosError } from 'axios';
import { getSession, signOut } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터
apiClient.interceptors.request.use(
  async (config) => {
    // 세션 토큰 자동 추가
    const session = await getSession();
    if ((session as any)?.accessToken) {
      config.headers.Authorization = `Bearer ${(session as any).accessToken}`;
    }

    // CSRF 토큰 추가 (필요한 경우)
    if (typeof document !== 'undefined') {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // 401 에러 처리 (인증 만료)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        const session = await getSession();
        if (session) {
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 갱신 실패 시 로그아웃
        if (typeof window !== 'undefined') {
          await signOut({ callbackUrl: '/login' });
        }
        return Promise.reject(refreshError);
      }
    }

    // 429 에러 처리 (Rate Limiting)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['x-ratelimit-reset'];
      const message = retryAfter
        ? `요청이 너무 많습니다. ${new Date(retryAfter).toLocaleTimeString('ko-KR')}에 다시 시도해주세요.`
        : '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';

      console.error(message);
      return Promise.reject(error);
    }

    // 403 에러 처리 (권한 없음)
    if (error.response?.status === 403) {
      console.error('이 작업을 수행할 권한이 없습니다.');
      return Promise.reject(error);
    }

    // 500 에러 처리 (서버 오류)
    if (error.response?.status && error.response.status >= 500) {
      console.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return Promise.reject(error);
    }

    // 네트워크 에러 처리
    if (!error.response) {
      console.error('네트워크 연결을 확인해주세요.');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// API 메서드 래퍼
export const api = {
  get: <T = any>(url: string, config = {}) => apiClient.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config = {}) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config = {}) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config = {}) =>
    apiClient.delete<T>(url, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config = {}) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),
};

export default apiClient;
