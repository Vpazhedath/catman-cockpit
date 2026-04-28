import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/bigquery';

interface EngineSignalResult {
  engine: string;
  count: number;
  message: string;
}

// Fallback data
function getSampleSignals() {
  return [
    { engine: 'choice', message: '52,524 SKUs blocked/on-hold need review', ctaLabel: 'Review assortment →', ctaTab: 'assortment' },
    { engine: 'affordability', message: '21,937 SKUs discontinued - price optimization needed', ctaLabel: 'View pricing →', ctaTab: 'price' },
    { engine: 'lifecycle', message: '43,758 SKUs retired - lifecycle review recommended', ctaLabel: 'Review lifecycle →', ctaTab: 'lifecycle' },
    { engine: 'profitability', message: '45 stores active - margin optimization opportunity', ctaLabel: 'View profitability →', ctaTab: 'profitability' },
  ];
}

export async function GET() {
  try {
    // Query for actionable signals based on SKU counts
    const query = `
      SELECT
        'choice' as engine,
        COUNT(*) as count
      FROM \`fulfillment-dwh-production.cl_dmart.skus\`
      WHERE entity = 'talabat_ae'
        AND sku_status IN ('BLOCKED', 'READY_FOR_PO', 'ON_HOLD')
      UNION ALL
      SELECT
        'affordability' as engine,
        COUNT(*) as count
      FROM \`fulfillment-dwh-production.cl_dmart.skus\`
      WHERE entity = 'talabat_ae'
        AND sku_status = 'DISCONTINUED'
      UNION ALL
      SELECT
        'lifecycle' as engine,
        COUNT(*) as count
      FROM \`fulfillment-dwh-production.cl_dmart.skus\`
      WHERE entity = 'talabat_ae'
        AND sku_status = 'RETIRED'
      UNION ALL
      SELECT
        'profitability' as engine,
        COUNT(DISTINCT store_id) as count
      FROM \`fulfillment-dwh-production.cl_dmart.orders\`
      WHERE entity = 'talabat_ae'
        AND DATE_TRUNC(order_date, MONTH) = DATE_TRUNC(CURRENT_DATE(), MONTH)
    `;

    const results = await runQuery<EngineSignalResult>(query);

    if (!results.length) {
      return NextResponse.json(getSampleSignals());
    }

    const ctaMap: Record<string, { label: string; tab: string }> = {
      choice: { label: 'Review assortment →', tab: 'assortment' },
      affordability: { label: 'View pricing →', tab: 'price' },
      lifecycle: { label: 'Review lifecycle →', tab: 'lifecycle' },
      profitability: { label: 'View profitability →', tab: 'profitability' },
    };

    const messageMap: Record<string, (count: number) => string> = {
      choice: (c) => `${c.toLocaleString()} SKUs blocked/on-hold need review`,
      affordability: (c) => `${c.toLocaleString()} SKUs discontinued - price optimization needed`,
      lifecycle: (c) => `${c.toLocaleString()} SKUs retired - lifecycle review recommended`,
      profitability: (c) => `${c} stores active - margin optimization opportunity`,
    };

    const signals = results.map(row => ({
      engine: row.engine as 'choice' | 'affordability' | 'lifecycle' | 'profitability',
      message: messageMap[row.engine]?.(row.count) || `${row.count} items need attention`,
      ctaLabel: ctaMap[row.engine]?.label || 'View details →',
      ctaTab: ctaMap[row.engine]?.tab || '/',
    }));

    return NextResponse.json(signals);
  } catch (error) {
    console.error('Engine signals query failed, using sample data:', error);
    return NextResponse.json(getSampleSignals());
  }
}