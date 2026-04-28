'use client';

import { ReactNode } from 'react';
import { NotificationProvider } from '@/lib/NotificationContext';
import { AppProvider } from '@/lib/AppContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { CatalystProvider } from '@/lib/CatalystContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <NotificationProvider>
          <CatalystProvider>
            {children}
          </CatalystProvider>
        </NotificationProvider>
      </AppProvider>
    </ThemeProvider>
  );
}