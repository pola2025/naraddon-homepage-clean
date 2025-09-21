'use client';

import { useAuth } from '@/contexts/AuthContext';

interface CanAccessProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  role?: string;
  permission?: string;
  resource?: string;
  action?: string;
}

export default function CanAccess({
  children,
  fallback = null,
  role,
  permission,
  resource,
  action,
}: CanAccessProps) {
  const { hasRole, hasPermission, checkAccess } = useAuth();

  let hasAccess = true;

  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  if (resource && action) {
    hasAccess = hasAccess && checkAccess(resource, action);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
