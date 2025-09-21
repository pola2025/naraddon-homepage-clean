'use client';

import dynamic from 'next/dynamic';

const PolicyAnalysis = dynamic(() => import('@/components/policy/PolicyAnalysis'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">로딩 중...</div>
    </div>
  ),
});

export default function PolicyAnalysisPage() {
  return <PolicyAnalysis />;
}
