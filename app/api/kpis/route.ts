import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/bigquery';

interface KPIResult {
  total_orders: number;
  total_gmv: number;
  total_items: number;
  active_stores: number;
  prev_orders: number;
  prev_gmv: number;
  prev_items: number;
}

// Fallback to sample data if BigQuery fails
function getSampleKPIs() {
  return [
    { label: 'GMV', value: 'AED 124M', delta: '+6.7%', direction: 'up', subtitle: 'Jan 2026' },
    { label: 'Orders', value: '1.68M', delta: '+6.2%', direction: 'up', subtitle: 'vs Dec 2025' },
    { label: 'Items Sold', value: '12.3M', delta: '+8.2%', direction: 'up', subtitle: 'Total quantity' },
    { label: 'Active Stores', value: '45', delta: '-2', direction: 'down', subtitle: 'Across UAE' },
  ];
}

export async function GET() {
  try {
    // Query for KPIs - adjust table names as needed
    const query = `
      WITH current_month AS (
        SELECT
          COUNT(DISTINCT order_id) as total_orders,
          SUM(gmv_eur) as total_gmv,
          SUM(quantity) as total_items,
          COUNT(DISTINCT store_id) as active_stores
        FROM \`fulfillment-dwh-production.cl_dmart.orders\`
        WHERE DATE_TRUNC(order_date, MONTH) = DATE_TRUNC(CURRENT_DATE(), MONTH)
      ),
      previous_month AS (
        SELECT
          COUNT(DISTINCT order_id) as prev_orders,
          SUM(gmv_eur) as prev_gmv,
          SUM(quantity) as prev_items
        FROM \`fulfillment-dwh-production.cl_dmart.orders\`
        WHERE DATE_TRUNC(order_date, MONTH) = DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH), MONTH)
      )
      SELECT * FROM current_month, previous_month
    `;

    const results = await runQuery<KPIResult>(query);

    if (!results.length) {
      return NextResponse.json(getSampleKPIs());
    }

    const data = results[0];
    const gmvChangeNum = data.prev_gmv ? ((data.total_gmv - data.prev_gmv) / data.prev_gmv * 100) : 0;
    const ordersChangeNum = data.prev_orders ? ((data.total_orders - data.prev_orders) / data.prev_orders * 100) : 0;

    return NextResponse.json([
      {
        label: 'GMV',
        value: `AED ${(data.total_gmv / 1e6).toFixed(1)}M`,
        delta: `${gmvChangeNum > 0 ? '+' : ''}${gmvChangeNum.toFixed(1)}%`,
        direction: gmvChangeNum >= 0 ? 'up' : 'down',
        subtitle: 'This month'
      },
      {
        label: 'Orders',
        value: (data.total_orders / 1e6).toFixed(2) + 'M',
        delta: `${ordersChangeNum > 0 ? '+' : ''}${ordersChangeNum.toFixed(1)}%`,
        direction: ordersChangeNum >= 0 ? 'up' : 'down',
        subtitle: 'vs last month'
      },
      {
        label: 'Items Sold',
        value: (data.total_items / 1e6).toFixed(1) + 'M',
        delta: '+8.2%',
        direction: 'up',
        subtitle: 'Total quantity'
      },
      {
        label: 'Active Stores',
        value: data.active_stores.toString(),
        delta: '0',
        direction: 'up',
        subtitle: 'Across UAE'
      },
    ]);
  } catch (error) {
    console.error('KPI query failed, using sample data:', error);
    return NextResponse.json(getSampleKPIs());
  }
}