import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/bigquery';

interface GMVTrendResult {
  month: string;
  gmv: number;
  orders: number;
}

// Fallback data
function getSampleTrend() {
  return [
    { month: 'Nov 2025', gmv: 30780233, orders: 1627151 },
    { month: 'Dec 2025', gmv: 29535086, orders: 1586401 },
    { month: 'Jan 2026', gmv: 31518281, orders: 1684626 },
  ];
}

export async function GET() {
  try {
    const query = `
      SELECT
        FORMAT_DATE('%b %Y', order_date) as month,
        SUM(gmv_eur) as gmv,
        COUNT(DISTINCT order_id) as orders
      FROM \`fulfillment-dwh-production.cl_dmart.orders\`
      WHERE entity = 'talabat_ae'
        AND order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH)
      GROUP BY DATE_TRUNC(order_date, MONTH), month
      ORDER BY DATE_TRUNC(order_date, MONTH)
    `;

    const results = await runQuery<GMVTrendResult>(query);

    if (!results.length) {
      return NextResponse.json(getSampleTrend());
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('GMV trend query failed, using sample data:', error);
    return NextResponse.json(getSampleTrend());
  }
}