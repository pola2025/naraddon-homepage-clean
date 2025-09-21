import { NextRequest, NextResponse } from 'next/server';
import { PerformanceMonitor } from '@/lib/performance-monitor';

export async function GET(request: NextRequest) {
  const monitor = PerformanceMonitor.getInstance();
  const stats = monitor.getStats();

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    performance: stats,
    version: process.env.npm_package_version || '1.0.0',
  };

  // 헬스 체크 기준
  const isHealthy = stats.memoryStats.heapUsedPercent < 90 && stats.errorStats.rate < 5;

  if (!isHealthy) {
    return NextResponse.json({ ...health, status: 'degraded' }, { status: 503 });
  }

  return NextResponse.json(health);
}