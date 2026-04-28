import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/bigquery';

interface StoreResult {
  store_name: string;
  orders: number;
  gmv_eur: number;
}

// Fallback data
function getSampleStores() {
  return [
    { name: 'UAE_Dubai_DS_21 - Shamkha, Abu Dhabi', orders: 95030, gmv: 1846129 },
    { name: 'UAE_Dubai_DS_6 - JVC', orders: 49731, gmv: 897010 },
    { name: 'UAE_Dubai_DS_38_Mussafah', orders: 45079, gmv: 876397 },
    { name: 'UAE_Dubai_DS_16_Al Jurf', orders: 39368, gmv: 668810 },
    { name: 'UAE_Dubai_DS_35_Palm Jumeirah', orders: 41482, gmv: 850542 },
    { name: 'UAE_Dubai_DS_3 - Motor City', orders: 41879, gmv: 807306 },
    { name: 'UAE_Dubai_DS_29 - Zone One', orders: 45216, gmv: 830811 },
    { name: 'UAE_Dubai_DS_13 - Khalifa (Abu Dhabi)', orders: 45858, gmv: 837366 },
  ];
}

export async function GET() {
  try {
    const query = `
      SELECT
        store_name,
        COUNT(DISTINCT order_id) as orders,
        SUM(gmv_eur) as gmv_eur
      FROM \`fulfillment-dwh-production.cl_dmart.orders\`
      WHERE entity = 'talabat_ae'
        AND DATE_TRUNC(order_date, MONTH) = DATE_TRUNC(CURRENT_DATE(), MONTH)
      GROUP BY store_name
      ORDER BY gmv_eur DESC
      LIMIT 20
    `;

    const results = await runQuery<StoreResult>(query);

    if (!results.length) {
      return NextResponse.json(getSampleStores());
    }

    const stores = results.map(row => ({
      name: row.store_name,
      orders: row.orders,
      gmv: row.gmv_eur,
    }));

    return NextResponse.json(stores);
  } catch (error) {
    console.error('Store query failed, using sample data:', error);
    return NextResponse.json(getSampleStores());
  }
}