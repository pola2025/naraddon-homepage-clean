'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  fallbackUrl?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  fallbackUrl = '/login',
}: ProtectedRouteProps) {
  const { user, loading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
        router.push(`${fallbackUrl}?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push('/403');
        return;
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push('/403');
        return;
      }
    }
  }, [
    user,
    loading,
    requiredRole,
    requiredPermission,
    router,
    fallbackUrl,
    hasRole,
    hasPermission,
  ]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
}
