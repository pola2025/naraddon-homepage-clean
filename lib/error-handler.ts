import { NextResponse } from 'next/server';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(ErrorCode.AUTHENTICATION_ERROR, message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(ErrorCode.AUTHORIZATION_ERROR, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(ErrorCode.NOT_FOUND, `${resource} not found`, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number = 60) {
    super(ErrorCode.RATE_LIMIT_ERROR, 'Too many requests', 429, { retryAfter });
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.DATABASE_ERROR, message, 500, details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, details?: any) {
    super(ErrorCode.EXTERNAL_SERVICE_ERROR, `External service error: ${service}`, 503, details);
  }
}

interface ErrorLogEntry {
  timestamp: string;
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: any;
  stack?: string;
  context?: {
    url?: string;
    method?: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
  };
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  private errorBuffer: ErrorLogEntry[] = [];
  private readonly maxBufferSize = 100;

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: AppError | Error, context?: ErrorLogEntry['context']): void {
    const logEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      code: error instanceof AppError ? error.code : ErrorCode.INTERNAL_ERROR,
      message: error.message,
      statusCode: error instanceof AppError ? error.statusCode : 500,
      details: error instanceof AppError ? error.details : undefined,
      stack: error.stack,
      context,
    };

    // 버퍼에 저장
    this.errorBuffer.push(logEntry);
    if (this.errorBuffer.length > this.maxBufferSize) {
      this.errorBuffer.shift();
    }

    // 콘솔 로깅
    if (process.env.NODE_ENV === 'development') {
      console.error('[ERROR]', logEntry);
    } else {
      // 프로덕션에서는 외부 로깅 서비스로 전송
      this.sendToExternalService(logEntry);
    }

    // 심각한 에러는 즉시 알림
    if (logEntry.statusCode >= 500) {
      this.sendAlert(logEntry);
    }
  }

  private sendToExternalService(logEntry: ErrorLogEntry): void {
    // Sentry, DataDog, CloudWatch 등으로 전송
    // 예: Sentry.captureException(error);
  }

  private sendAlert(logEntry: ErrorLogEntry): void {
    // Slack, Discord, Email 등으로 알림
    // 예: sendSlackNotification(logEntry);
  }

  getRecentErrors(count: number = 10): ErrorLogEntry[] {
    return this.errorBuffer.slice(-count);
  }

  clearBuffer(): void {
    this.errorBuffer = [];
  }
}

export function handleError(error: unknown, context?: ErrorLogEntry['context']): NextResponse {
  const logger = ErrorLogger.getInstance();

  if (error instanceof AppError) {
    logger.log(error, context);

    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: process.env.NODE_ENV === 'development' ? error.details : undefined,
        },
      },
      { status: error.statusCode }
    );
  }

  // 알 수 없는 에러
  const unknownError = new AppError(ErrorCode.INTERNAL_ERROR, 'An unexpected error occurred', 500);

  logger.log(error as Error, context);

  return NextResponse.json(
    {
      error: {
        code: unknownError.code,
        message: unknownError.message,
      },
    },
    { status: 500 }
  );
}

// 에러 복구 전략
export class ErrorRecovery {
  private static retryCountMap = new Map<string, number>();
  private static readonly maxRetries = 3;
  private static readonly retryDelay = 1000;

  static async withRetry<T>(
    fn: () => Promise<T>,
    key: string,
    options?: {
      maxRetries?: number;
      delay?: number;
      backoff?: boolean;
    }
  ): Promise<T> {
    const maxRetries = options?.maxRetries || this.maxRetries;
    const delay = options?.delay || this.retryDelay;
    const backoff = options?.backoff ?? true;

    let retries = this.retryCountMap.get(key) || 0;

    try {
      const result = await fn();
      this.retryCountMap.delete(key);
      return result;
    } catch (error) {
      retries++;
      this.retryCountMap.set(key, retries);

      if (retries >= maxRetries) {
        this.retryCountMap.delete(key);
        throw error;
      }

      const waitTime = backoff ? delay * Math.pow(2, retries - 1) : delay;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      return this.withRetry(fn, key, options);
    }
  }

  static async withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    try {
      return await primary();
    } catch (error) {
      console.warn('Primary operation failed, using fallback:', error);
      return await fallback();
    }
  }

  static async withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      ),
    ]);
  }
}
