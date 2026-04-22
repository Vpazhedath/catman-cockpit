'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  entity: string;
  categoryL0: string;
  categoryL1: string;
  categoryL2: string;
  dateRange: string;
  searchQuery: string;
}

interface AppContextType {
  state: AppState;
  setEntity: (entity: string) => void;
  setCategoryL0: (l0: string) => void;
  setCategoryL1: (l1: string) => void;
  setCategoryL2: (l2: string) => void;
  setDateRange: (range: string) => void;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    entity: 'Talabat UAE',
    categoryL0: 'all',
    categoryL1: 'all',
    categoryL2: 'all',
    dateRange: 'Last 7 days',
    searchQuery: '',
  });

  const setEntity = (entity: string) => setState(prev => ({ ...prev, entity }));
  const setCategoryL0 = (categoryL0: string) => setState(prev => ({ ...prev, categoryL0 }));
  const setCategoryL1 = (categoryL1: string) => setState(prev => ({ ...prev, categoryL1 }));
  const setCategoryL2 = (categoryL2: string) => setState(prev => ({ ...prev, categoryL2 }));
  const setDateRange = (dateRange: string) => setState(prev => ({ ...prev, dateRange }));
  const setSearchQuery = (query: string) => setState(prev => ({ ...prev, searchQuery: query }));

  return (
    <AppContext.Provider value={{ state, setEntity, setCategoryL0, setCategoryL1, setCategoryL2, setDateRange, setSearchQuery }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}