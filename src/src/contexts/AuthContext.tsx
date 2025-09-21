'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'examiner' | 'user';
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  checkAccess: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: (session.user as any).id || '',
        email: session.user.email!,
        name: session.user.name || undefined,
        role: (session.user as any).role || 'user',
        permissions: (session.user as any).permissions || [],
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role || (user.role === 'admin' && role !== 'admin');
  };

  const checkAccess = (resource: string, action: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;

    const permission = `${resource}:${action}`;
    return hasPermission(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === 'loading',
        isAuthenticated: !!user,
        hasPermission,
        hasRole,
        checkAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
