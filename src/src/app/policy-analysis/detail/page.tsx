'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PolicyAnalysisDetail from '@/components/policy/PolicyAnalysisDetail';

function PolicyAnalysisDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1';

  return <PolicyAnalysisDetail postId={id} />;
}

export default function PolicyAnalysisDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <PolicyAnalysisDetailContent />
    </Suspense>
  );
}
