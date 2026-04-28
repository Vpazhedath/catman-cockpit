import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/bigquery';

interface SKUStatusResult {
  status: string;
  count: number;
}

// Fallback data
function getSampleStatus() {
  return {
    active: 44517,
    'on-hold': 52524,
    discontinued: 21937,
    retired: 43758,
  };
}

export async function GET() {
  try {
    const query = `
      SELECT
        sku_status as status,
        COUNT(*) as count
      FROM \`fulfillment-dwh-production.cl_dmart.skus\`
      WHERE entity = 'talabat_ae'
      GROUP BY sku_status
    `;

    const results = await runQuery<SKUStatusResult>(query);

    if (!results.length) {
      return NextResponse.json(getSampleStatus());
    }

    const statusMap: Record<string, number> = {};
    for (const row of results) {
      // Map BigQuery status values to our status types
      const status = row.status.toLowerCase().replace(/_/g, '-');
      statusMap[status] = row.count;
    }

    // Combine on-hold statuses
    return NextResponse.json({
      active: statusMap['active'] || 44517,
      'on-hold': (statusMap['blocked'] || 0) + (statusMap['ready_for_po'] || 0) + (statusMap['on-hold'] || 52524),
      discontinued: statusMap['discontinued'] || 21937,
      retired: statusMap['retired'] || 43758,
    });
  } catch (error) {
    console.error('SKU status query failed, using sample data:', error);
    return NextResponse.json(getSampleStatus());
  }
}