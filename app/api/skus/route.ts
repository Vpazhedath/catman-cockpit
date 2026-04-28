import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/bigquery';
import { SAMPLE_SKUS } from '@/lib/sample-data';

interface SKUResult {
  sku_id: string;
  sku_name: string;
  category: string;
  status: string;
  maturity_stage: string;
  cost_price: number;
  base_price: number;
  discount: number | null;
  margin: number;
  supplier: string;
  weekly_units_sold: number;
  availability: number;
  engine_signals: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    let whereClause = "entity = 'talabat_ae'";
    if (status && status !== 'all') {
      whereClause += ` AND sku_status = '${status.toUpperCase().replace('-', '_')}'`;
    }
    if (category && category !== 'all') {
      whereClause += ` AND category = '${category}'`;
    }
    if (search) {
      whereClause += ` AND (LOWER(sku_name) LIKE '%${search.toLowerCase()}%' OR LOWER(supplier) LIKE '%${search.toLowerCase()}%')`;
    }

    const query = `
      SELECT
        sku_id,
        sku_name,
        category,
        sku_status as status,
        maturity_stage,
        cost_price,
        base_price,
        discount_pct as discount,
        margin_pct as margin,
        supplier,
        weekly_units_sold,
        availability_pct as availability,
        engine_signals
      FROM \`fulfillment-dwh-production.cl_dmart.skus\`
      WHERE ${whereClause}
      ORDER BY weekly_units_sold DESC
      LIMIT ${limit}
    `;

    const results = await runQuery<SKUResult>(query);

    if (!results.length) {
      // Return sample data filtered
      let filtered = [...SAMPLE_SKUS];
      if (status && status !== 'all') {
        filtered = filtered.filter(s => s.status === status);
      }
      if (category && category !== 'all') {
        filtered = filtered.filter(s => s.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(s =>
          s.name.toLowerCase().includes(q) ||
          s.supplier.toLowerCase().includes(q)
        );
      }
      return NextResponse.json(filtered.slice(0, limit));
    }

    // Transform results to match our interface
    const skus = results.map(row => ({
      skuId: row.sku_id,
      name: row.sku_name,
      category: row.category,
      status: row.status.toLowerCase().replace(/_/g, '-') as 'active' | 'on-hold' | 'discontinued' | 'retired',
      maturityStage: (row.maturity_stage || 'mature').toLowerCase() as 'new' | 'probation' | 'mature' | 'review' | 'phase-out',
      efficiency: 'efficient' as const,
      costPrice: row.cost_price || 0,
      basePrice: row.base_price || 0,
      discount: row.discount,
      margin: row.margin || 30,
      engineSignals: row.engine_signals ? row.engine_signals.split(',') : [],
      supplier: row.supplier || 'Unknown',
      weeklyUnitsSold: row.weekly_units_sold || 0,
      availability: row.availability || 95,
      warehouses: [], // Would need separate query for warehouse data
    }));

    return NextResponse.json(skus);
  } catch (error) {
    console.error('SKU query failed, using sample data:', error);
    // Return sample data as fallback
    let filtered = [...SAMPLE_SKUS];
    if (status && status !== 'all') {
      filtered = filtered.filter(s => s.status === status);
    }
    if (category && category !== 'all') {
      filtered = filtered.filter(s => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.supplier.toLowerCase().includes(q)
      );
    }
    return NextResponse.json(filtered.slice(0, limit));
  }
}