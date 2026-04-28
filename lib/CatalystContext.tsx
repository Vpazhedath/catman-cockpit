'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolUse?: {
    name: string;
    input: Record<string, unknown>;
    result?: unknown;
  };
  isStreaming?: boolean;
}

interface CatalystState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
}

interface CatalystContextType {
  state: CatalystState;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  togglePanel: () => void;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const CatalystContext = createContext<CatalystContextType | undefined>(undefined);

export function CatalystProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalystState>({
    messages: [],
    isOpen: false,
    isLoading: false,
  });

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>): string => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { ...message, id, timestamp: new Date() }],
    }));
    return id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  const togglePanel = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, isOpen: open }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  return (
    <CatalystContext.Provider value={{
      state,
      addMessage,
      updateMessage,
      clearMessages,
      togglePanel,
      setOpen,
      setLoading,
    }}>
      {children}
    </CatalystContext.Provider>
  );
}

export function useCatalyst() {
  const context = useContext(CatalystContext);
  if (!context) {
    throw new Error('useCatalyst must be used within a CatalystProvider');
  }
  return context;
}