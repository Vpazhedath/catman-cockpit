'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  entity: string;
  category: string;
  dateRange: string;
  searchQuery: string;
}

interface AppContextType {
  state: AppState;
  setEntity: (entity: string) => void;
  setCategory: (category: string) => void;
  setDateRange: (range: string) => void;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    entity: 'Talabat UAE',
    category: 'all',
    dateRange: 'Last 7 days',
    searchQuery: '',
  });

  const setEntity = (entity: string) => setState(prev => ({ ...prev, entity }));
  const setCategory = (category: string) => setState(prev => ({ ...prev, category }));
  const setDateRange = (dateRange: string) => setState(prev => ({ ...prev, dateRange }));
  const setSearchQuery = (query: string) => setState(prev => ({ ...prev, searchQuery: query }));

  return (
    <AppContext.Provider value={{ state, setEntity, setCategory, setDateRange, setSearchQuery }}>
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