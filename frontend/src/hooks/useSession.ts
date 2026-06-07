'use client';

import { useQuery } from '@tanstack/react-query';

interface SessionData {
  userId: string;
  cooperativeId: string;
  role: 'admin' | 'rh' | 'dp' | 'viewer';
  name: string;
  email: string;
  isLoggedIn: boolean;
}

export function useSession() {
  return useQuery<SessionData>({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        throw new Error('Não autenticado');
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });
}
