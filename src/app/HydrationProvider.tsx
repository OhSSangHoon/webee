"use client";

import { useEffect } from 'react';
import { hydrateUserStore } from '@/shared/auth/useUserStore';

export default function HydrationProvider({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 클라이언트에서 zustand 상태 복원
    hydrateUserStore();
  }, []);

  return <>{children}</>;
}