import { BigQuery } from '@google-cloud/bigquery';

// BigQuery configuration
const PROJECT_ID = process.env.BIGQUERY_PROJECT_ID || 'fulfillment-dwh-production';
const DATASET = process.env.BIGQUERY_DATASET || 'cl_dmart';

// Initialize BigQuery client
// Uses GOOGLE_APPLICATION_CREDENTIALS env var for auth
export const bigquery = new BigQuery({
  projectId: PROJECT_ID,
});

export const DATASET_ID = DATASET;
export const PROJECT_ID_VALUE = PROJECT_ID;

// Helper to run queries
export async function runQuery<T>(query: string): Promise<T[]> {
  try {
    const [rows] = await bigquery.query({ query, location: 'EU' });
    return rows as T[];
  } catch (error) {
    console.error('BigQuery error:', error);
    throw error;
  }
}

// Cache helper - simple in-memory cache for development
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function cachedQuery<T>(key: string, query: string): Promise<T[]> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T[];
  }
  const data = await runQuery<T>(query);
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}