'use client';

import { ReactNode } from 'react';
import { NotificationProvider } from '@/lib/NotificationContext';
import { AppProvider } from '@/lib/AppContext';
import { ThemeProvider } from '@/lib/ThemeContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AppProvider>
    </ThemeProvider>
  );
}