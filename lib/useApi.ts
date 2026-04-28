'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  initialData?: T;
  transform?: (data: unknown) => T;
}

export function useApi<T>(url: string, options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | undefined>(options.initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(options.transform ? options.transform(json) : json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [url, options.transform]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

// Type definitions for API responses
export interface KPI {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down';
  subtitle: string;
}

export interface GMVTrendPoint {
  month: string;
  gmv: number;
  orders: number;
}

export interface SKUStatusCounts {
  active: number;
  'on-hold': number;
  discontinued: number;
  retired: number;
}

export interface Store {
  name: string;
  orders: number;
  gmv: number;
}

export interface EngineSignal {
  engine: 'choice' | 'affordability' | 'lifecycle' | 'profitability';
  message: string;
  ctaLabel: string;
  ctaTab: string;
}