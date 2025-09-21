interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface RequestMetric {
  url: string;
  method: string;
  duration: number;
  statusCode?: number;
  timestamp: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private requestMetrics: RequestMetric[] = [];
  private readonly maxMetrics = 1000;
  private readonly alertThresholds = {
    requestDuration: 3000, // ms
    memoryUsage: 0.9, // 90% of heap
    errorRate: 0.05, // 5%
    p95Duration: 5000, // ms
  };

  private constructor() {
    this.startMemoryMonitoring();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackRequest(metric: RequestMetric): void {
    // 메모리 사용량 추가
    metric.memoryUsage = process.memoryUsage();

    this.requestMetrics.push(metric);

    // 버퍼 크기 제한
    if (this.requestMetrics.length > this.maxMetrics) {
      this.requestMetrics.shift();
    }

    // 알림 체크
    this.checkAlerts(metric);

    // 메트릭 집계
    this.aggregateMetrics();
  }

  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  private startMemoryMonitoring(): void {
    setInterval(() => {
      const memUsage = process.memoryUsage();
      const heapUsedPercent = memUsage.heapUsed / memUsage.heapTotal;

      this.recordMetric('memory.heap.used', memUsage.heapUsed);
      this.recordMetric('memory.heap.total', memUsage.heapTotal);
      this.recordMetric('memory.heap.percent', heapUsedPercent);
      this.recordMetric('memory.rss', memUsage.rss);
      this.recordMetric('memory.external', memUsage.external);

      if (heapUsedPercent > this.alertThresholds.memoryUsage) {
        console.warn(`[MEMORY ALERT] Heap usage is ${(heapUsedPercent * 100).toFixed(2)}%`);
        this.triggerMemoryCleanup();
      }
    }, 30000); // 30초마다 체크
  }

  private triggerMemoryCleanup(): void {
    if (global.gc) {
      global.gc();
      console.log('[MEMORY] Manual garbage collection triggered');
    }
  }

  private checkAlerts(metric: RequestMetric): void {
    // 느린 요청 알림
    if (metric.duration > this.alertThresholds.requestDuration) {
      console.warn(`[SLOW REQUEST] ${metric.method} ${metric.url} took ${metric.duration}ms`);
    }

    // 에러율 체크
    const recentRequests = this.getRecentRequests(100);
    const errorRate =
      recentRequests.filter((r) => r.statusCode && r.statusCode >= 500).length /
      recentRequests.length;

    if (errorRate > this.alertThresholds.errorRate) {
      console.error(`[HIGH ERROR RATE] Error rate is ${(errorRate * 100).toFixed(2)}%`);
    }
  }

  private aggregateMetrics(): void {
    const recentRequests = this.getRecentRequests(100);
    if (recentRequests.length === 0) return;

    const durations = recentRequests.map((r) => r.duration).sort((a, b) => a - b);

    // 통계 계산
    const stats = {
      count: durations.length,
      mean: durations.reduce((a, b) => a + b, 0) / durations.length,
      median: durations[Math.floor(durations.length / 2)],
      p95: durations[Math.floor(durations.length * 0.95)],
      p99: durations[Math.floor(durations.length * 0.99)],
      min: durations[0],
      max: durations[durations.length - 1],
    };

    this.recordMetric('request.count', stats.count);
    this.recordMetric('request.duration.mean', stats.mean);
    this.recordMetric('request.duration.median', stats.median);
    this.recordMetric('request.duration.p95', stats.p95);
    this.recordMetric('request.duration.p99', stats.p99);

    // P95가 임계값을 초과하면 알림
    if (stats.p95 > this.alertThresholds.p95Duration) {
      console.warn(`[PERFORMANCE ALERT] P95 duration is ${stats.p95}ms`);
    }
  }

  getRecentRequests(count: number = 10): RequestMetric[] {
    return this.requestMetrics.slice(-count);
  }

  getMetrics(name?: string, since?: number): PerformanceMetric[] {
    let filtered = this.metrics;

    if (name) {
      filtered = filtered.filter((m) => m.name === name);
    }

    if (since) {
      filtered = filtered.filter((m) => m.timestamp >= since);
    }

    return filtered;
  }

  getStats(): {
    requestStats: any;
    memoryStats: any;
    errorStats: any;
  } {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const recentRequests = this.requestMetrics.filter((r) => r.timestamp >= fiveMinutesAgo);

    const durations = recentRequests.map((r) => r.duration);
    const errorCount = recentRequests.filter((r) => r.statusCode && r.statusCode >= 500).length;

    const memUsage = process.memoryUsage();

    return {
      requestStats: {
        total: recentRequests.length,
        avgDuration: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
        maxDuration: durations.length ? Math.max(...durations) : 0,
        minDuration: durations.length ? Math.min(...durations) : 0,
      },
      memoryStats: {
        heapUsed: memUsage.heapUsed,
        heapTotal: memUsage.heapTotal,
        rss: memUsage.rss,
        external: memUsage.external,
        heapUsedPercent: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      },
      errorStats: {
        count: errorCount,
        rate: recentRequests.length ? (errorCount / recentRequests.length) * 100 : 0,
      },
    };
  }

  reset(): void {
    this.metrics = [];
    this.requestMetrics = [];
  }
}

// Rate Limiter 클래스
export class RateLimiter {
  private limits = new Map<string, { count: number; resetTime: number }>();
  private readonly defaultLimit: number;
  private readonly windowMs: number;

  constructor(limit: number = 100, windowMs: number = 60000) {
    this.defaultLimit = limit;
    this.windowMs = windowMs;

    // 주기적으로 만료된 엔트리 정리
    setInterval(() => this.cleanup(), windowMs);
  }

  check(
    key: string,
    limit?: number
  ): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const effectiveLimit = limit || this.defaultLimit;
    const userLimit = this.limits.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });

      return {
        allowed: true,
        remaining: effectiveLimit - 1,
        resetTime: now + this.windowMs,
      };
    }

    const remaining = effectiveLimit - userLimit.count;

    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: userLimit.resetTime,
      };
    }

    userLimit.count++;

    return {
      allowed: true,
      remaining: remaining - 1,
      resetTime: userLimit.resetTime,
    };
  }

  reset(key: string): void {
    this.limits.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Circuit Breaker 패턴 구현
export class CircuitBreaker {
  private failures = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly threshold: number = 5,
    private readonly timeout: number = 60000,
    private readonly successThreshold: number = 3
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      console.error('[CIRCUIT BREAKER] Circuit opened due to failures');
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
  }
}
