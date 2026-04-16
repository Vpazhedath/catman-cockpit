'use client';

import { ReactNode } from 'react';
import { NotificationProvider } from '@/lib/NotificationContext';
import { AppProvider } from '@/lib/AppContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </AppProvider>
  );
}