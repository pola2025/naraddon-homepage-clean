'use client';

import React, { Suspense } from 'react';
import PolicyNewsSection from '@/components/PolicyNewsSection/PolicyNewsSection';

export default function PolicyNewsPage() {
  return (
    <Suspense fallback={null}>
      <PolicyNewsSection />
    </Suspense>
  );
}
