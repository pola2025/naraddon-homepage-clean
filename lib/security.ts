import crypto from 'crypto';
import { NextRequest } from 'next/server';

// CSRF 토큰 생성 및 검증
export class CSRFProtection {
  private static readonly tokenLength = 32;
  private static readonly tokenExpiry = 24 * 60 * 60 * 1000; // 24시간

  static generateToken(): string {
    return crypto.randomBytes(this.tokenLength).toString('hex');
  }

  static validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) return false;
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken));
  }

  static createTokenWithExpiry(): {
    token: string;
    expires: number;
  } {
    return {
      token: this.generateToken(),
      expires: Date.now() + this.tokenExpiry,
    };
  }

  static isTokenExpired(expires: number): boolean {
    return Date.now() > expires;
  }
}

// XSS 방지
export class XSSProtection {
  private static readonly dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<applet/gi,
  ];

  static sanitizeInput(input: string): string {
    if (!input) return '';

    let sanitized = input;

    // HTML 엔티티 인코딩
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  static detectXSS(input: string): boolean {
    return this.dangerousPatterns.some((pattern) => pattern.test(input));
  }

  static sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeInput(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }
}

// SQL Injection 방지
export class SQLInjectionProtection {
  private static readonly sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|FROM|WHERE)\b)/gi,
    /(\-\-|\/\*|\*\/|;|\||\'|\")/g,
    /(\bOR\b\s*\d+\s*=\s*\d+)/gi,
    /(\bAND\b\s*\d+\s*=\s*\d+)/gi,
  ];

  static detectSQLInjection(input: string): boolean {
    return this.sqlPatterns.some((pattern) => pattern.test(input));
  }

  static escapeSQLString(input: string): string {
    if (!input) return '';
    return input
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\x00/g, '\\x00')
      .replace(/\x1a/g, '\\x1a');
  }

  static validateQueryParams(params: Record<string, any>): {
    valid: boolean;
    suspicious: string[];
  } {
    const suspicious: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      const stringValue = String(value);
      if (this.detectSQLInjection(stringValue)) {
        suspicious.push(key);
      }
    }

    return {
      valid: suspicious.length === 0,
      suspicious,
    };
  }
}

// 입력 검증
export class InputValidator {
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isAlphanumeric(input: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(input);
  }

  static isPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  }

  static validateLength(input: string, min: number, max: number): boolean {
    return input.length >= min && input.length <= max;
  }

  static validateFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  }

  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\.{2,}/g, '_')
      .replace(/^\./, '_');
  }
}

// 보안 헤더 관리
export class SecurityHeaders {
  static getDefaultHeaders(): Record<string, string> {
    return {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': this.getCSP(),
    };
  }

  private static getCSP(): string {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.*.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];

    return directives.join('; ');
  }

  static getNonce(): string {
    return crypto.randomBytes(16).toString('base64');
  }

  static getCORSHeaders(origin: string, allowedOrigins: string[]): Record<string, string> {
    const headers: Record<string, string> = {};

    if (allowedOrigins.includes(origin)) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Credentials'] = 'true';
      headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token';
      headers['Access-Control-Max-Age'] = '86400';
    }

    return headers;
  }
}

// IP 기반 보안
export class IPSecurity {
  private static blacklist = new Set<string>();
  private static whitelist = new Set<string>();
  private static requestCounts = new Map<string, { count: number; firstRequest: number }>();

  static addToBlacklist(ip: string): void {
    this.blacklist.add(ip);
  }

  static addToWhitelist(ip: string): void {
    this.whitelist.add(ip);
  }

  static isBlacklisted(ip: string): boolean {
    return this.blacklist.has(ip);
  }

  static isWhitelisted(ip: string): boolean {
    return this.whitelist.has(ip);
  }

  static trackRequest(ip: string): void {
    const now = Date.now();
    const tracking = this.requestCounts.get(ip);

    if (!tracking) {
      this.requestCounts.set(ip, { count: 1, firstRequest: now });
    } else {
      tracking.count++;
    }
  }

  static detectSuspiciousActivity(
    ip: string,
    threshold: number = 100,
    timeWindow: number = 60000
  ): boolean {
    const tracking = this.requestCounts.get(ip);
    if (!tracking) return false;

    const now = Date.now();
    const timeDiff = now - tracking.firstRequest;

    if (timeDiff < timeWindow && tracking.count > threshold) {
      return true;
    }

    // 시간 윈도우가 지나면 카운터 리셋
    if (timeDiff >= timeWindow) {
      this.requestCounts.set(ip, { count: 1, firstRequest: now });
    }

    return false;
  }

  static getClientIP(request: NextRequest): string {
    return (
      request.ip ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'
    );
  }
}

// 암호화 유틸리티
export class Encryption {
  private static readonly algorithm = 'aes-256-gcm';
  private static readonly saltLength = 32;
  private static readonly tagLength = 16;
  private static readonly ivLength = 16;

  static encrypt(
    text: string,
    password: string
  ): {
    encrypted: string;
    salt: string;
    iv: string;
    tag: string;
  } {
    const salt = crypto.randomBytes(this.saltLength);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = (cipher as any).getAuthTag();

    return {
      encrypted,
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  static decrypt(
    encryptedData: {
      encrypted: string;
      salt: string;
      iv: string;
      tag: string;
    },
    password: string
  ): string {
    const salt = Buffer.from(encryptedData.salt, 'hex');
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
    (decipher as any).setAuthTag(tag);

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
    return `${salt}:${hash}`;
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(verifyHash));
  }
}
