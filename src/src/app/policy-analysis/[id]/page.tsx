'use client';

import { useParams } from 'next/navigation';
import PolicyAnalysisDetail from '@/components/policy/PolicyAnalysisDetail';

export default function PolicyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <PolicyAnalysisDetail postId={id} />;
}
