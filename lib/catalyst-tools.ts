import { SAMPLE_SKUS, SAMPLE_KPIS, SAMPLE_ENGINE_SIGNALS, UAE_SKU_STATUS_COUNTS, UAE_GMV_TREND, UAE_STORES, WAREHOUSE_CLUSTERS } from './sample-data';

// Category options for display names
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'all': 'All Categories',
  'beverages': 'Beverages',
  'dairy-chilled-eggs': 'Dairy & Eggs',
  'snacks': 'Snacks & Confectionery',
  'personal-care-baby-health': 'Personal Care',
  'home-pet': 'Home & Pet',
  'frozen': 'Frozen Foods',
  'packaged-foods': 'Packaged Foods',
};
import type { SKUStatus } from './sample-data';

// Tool definitions for Claude
export const CATALYST_TOOLS = [
  {
    name: 'get_kpis',
    description: 'Get current performance KPIs including GMV, orders, items sold, and active stores. Use this to monitor overall category performance.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'search_skus',
    description: 'Search and filter SKUs by status, category, supplier, or search term. Returns a list of matching SKUs with key metrics.',
    input_schema: {
      type: 'object' as const,
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'on-hold', 'discontinued', 'retired', 'all'],
          description: 'Filter by SKU status',
        },
        category: {
          type: 'string',
          description: 'Filter by category ID (e.g., beverages, dairy-chilled-eggs, snacks)',
        },
        search: {
          type: 'string',
          description: 'Search term for SKU name or supplier',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default 10)',
        },
        efficiency: {
          type: 'string',
          enum: ['efficient', 'slow-mover', 'zero-mover', 'low-availability'],
          description: 'Filter by efficiency classification',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_sku_details',
    description: 'Get detailed information about a specific SKU including warehouse distribution, pricing, and engine signals.',
    input_schema: {
      type: 'object' as const,
      properties: {
        skuId: {
          type: 'string',
          description: 'The SKU ID to look up',
        },
      },
      required: ['skuId'],
    },
  },
  {
    name: 'update_sku_status',
    description: 'Update the status of an SKU. Use this to activate, put on hold, discontinue, or retire an SKU. Requires confirmation before execution.',
    input_schema: {
      type: 'object' as const,
      properties: {
        skuId: {
          type: 'string',
          description: 'The SKU ID to update',
        },
        newStatus: {
          type: 'string',
          enum: ['active', 'on-hold', 'discontinued', 'retired'],
          description: 'The new status to set',
        },
        warehouses: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific warehouses to update (optional, defaults to all)',
        },
      },
      required: ['skuId', 'newStatus'],
    },
  },
  {
    name: 'get_engine_signals',
    description: 'Get pending engine recommendations and signals that require category manager attention.',
    input_schema: {
      type: 'object' as const,
      properties: {
        engine: {
          type: 'string',
          enum: ['choice', 'affordability', 'lifecycle', 'profitability', 'all'],
          description: 'Filter by specific engine',
        },
      },
      required: [],
    },
  },
  {
    name: 'analyze_category',
    description: 'Analyze performance of a specific category including SKU counts, revenue distribution, and trends.',
    input_schema: {
      type: 'object' as const,
      properties: {
        category: {
          type: 'string',
          description: 'Category ID to analyze',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_status_distribution',
    description: 'Get the distribution of SKU statuses across the category.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_warehouse_clusters',
    description: 'Get information about warehouse clusters and their configurations.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
];

// Tool execution functions
export function executeGetKpis(): object {
  return {
    kpis: SAMPLE_KPIS,
    gmvTrend: UAE_GMV_TREND,
    storeCount: UAE_STORES.length,
  };
}

export function executeSearchSkus(params: {
  status?: string;
  category?: string;
  search?: string;
  limit?: number;
  efficiency?: string;
}): object {
  let results = [...SAMPLE_SKUS];

  if (params.status && params.status !== 'all') {
    results = results.filter(sku => sku.status === params.status);
  }

  if (params.category && params.category !== 'all') {
    results = results.filter(sku => sku.category === params.category);
  }

  if (params.efficiency) {
    results = results.filter(sku => sku.efficiency === params.efficiency);
  }

  if (params.search) {
    const term = params.search.toLowerCase();
    results = results.filter(sku =>
      sku.name.toLowerCase().includes(term) ||
      sku.supplier.toLowerCase().includes(term) ||
      sku.skuId.toLowerCase().includes(term)
    );
  }

  const limit = params.limit || 10;
  results = results.slice(0, limit);

  return {
    count: results.length,
    skus: results.map(sku => ({
      skuId: sku.skuId,
      name: sku.name,
      supplier: sku.supplier,
      category: sku.category,
      status: sku.status,
      maturityStage: sku.maturityStage,
      efficiency: sku.efficiency,
      margin: sku.margin,
      weeklyUnitsSold: sku.weeklyUnitsSold,
      availability: sku.availability,
      engineSignals: sku.engineSignals,
      warehousesInStock: sku.warehouses.filter(w => w.inStock).length,
      totalWarehouses: sku.warehouses.length,
    })),
  };
}

export function executeGetSkuDetails(skuId: string): object | null {
  const sku = SAMPLE_SKUS.find(s => s.skuId === skuId);
  if (!sku) return null;

  return {
    skuId: sku.skuId,
    name: sku.name,
    supplier: sku.supplier,
    category: sku.category,
    status: sku.status,
    maturityStage: sku.maturityStage,
    efficiency: sku.efficiency,
    costPrice: sku.costPrice,
    basePrice: sku.basePrice,
    discount: sku.discount,
    margin: sku.margin,
    weeklyUnitsSold: sku.weeklyUnitsSold,
    availability: sku.availability,
    engineSignals: sku.engineSignals,
    warehouses: sku.warehouses.map(w => ({
      warehouse: w.warehouse,
      status: w.status,
      inStock: w.inStock,
      quantity: w.quantity,
      lastUpdated: w.lastUpdated,
    })),
  };
}

export function executeUpdateSkuStatus(
  params: { skuId: string; newStatus: SKUStatus; warehouses?: string[] },
  updateCallback?: (skuId: string, newStatus: SKUStatus, warehouses?: string[]) => boolean
): object {
  const sku = SAMPLE_SKUS.find(s => s.skuId === params.skuId);
  if (!sku) {
    return { success: false, error: `SKU ${params.skuId} not found` };
  }

  // If callback is provided, execute the actual update
  if (updateCallback) {
    const success = updateCallback(params.skuId, params.newStatus, params.warehouses);
    return {
      success,
      skuId: params.skuId,
      skuName: sku.name,
      previousStatus: sku.status,
      newStatus: params.newStatus,
      warehousesAffected: params.warehouses || 'all',
    };
  }

  // Return what would happen (for preview)
  return {
    success: true,
    preview: true,
    skuId: params.skuId,
    skuName: sku.name,
    currentStatus: sku.status,
    proposedStatus: params.newStatus,
    warehousesToAffect: params.warehouses || 'all warehouses',
    message: `Would change ${sku.name} from ${sku.status} to ${params.newStatus}`,
  };
}

export function executeGetEngineSignals(params: { engine?: string }): object {
  let signals = [...SAMPLE_ENGINE_SIGNALS];

  if (params.engine && params.engine !== 'all') {
    signals = signals.filter(s => s.engine === params.engine);
  }

  // Also get SKUs with engine signals
  const skusWithSignals = SAMPLE_SKUS.filter(sku => sku.engineSignals.length > 0);

  return {
    signals,
    skusNeedingAttention: skusWithSignals.length,
    breakdown: {
      choice: skusWithSignals.filter(s => s.engineSignals.includes('choice')).length,
      affordability: skusWithSignals.filter(s => s.engineSignals.includes('affordability')).length,
      lifecycle: skusWithSignals.filter(s => s.engineSignals.includes('lifecycle')).length,
      profitability: skusWithSignals.filter(s => s.engineSignals.includes('profitability')).length,
    },
  };
}

export function executeAnalyzeCategory(categoryId: string): object {
  const categorySkus = SAMPLE_SKUS.filter(sku => sku.category === categoryId);
  const categoryName = CATEGORY_DISPLAY_NAMES[categoryId] || categoryId;

  if (categorySkus.length === 0) {
    return { error: `No SKUs found for category ${categoryName}` };
  }

  const totalUnits = categorySkus.reduce((sum, sku) => sum + sku.weeklyUnitsSold, 0);
  const avgMargin = categorySkus.reduce((sum, sku) => sum + sku.margin, 0) / categorySkus.length;
  const avgAvailability = categorySkus.reduce((sum, sku) => sum + sku.availability, 0) / categorySkus.length;

  const statusCounts = {
    active: categorySkus.filter(s => s.status === 'active').length,
    onHold: categorySkus.filter(s => s.status === 'on-hold').length,
    discontinued: categorySkus.filter(s => s.status === 'discontinued').length,
    retired: categorySkus.filter(s => s.status === 'retired').length,
  };

  const efficiencyCounts = {
    efficient: categorySkus.filter(s => s.efficiency === 'efficient').length,
    slowMover: categorySkus.filter(s => s.efficiency === 'slow-mover').length,
    zeroMover: categorySkus.filter(s => s.efficiency === 'zero-mover').length,
    lowAvailability: categorySkus.filter(s => s.efficiency === 'low-availability').length,
  };

  return {
    category: categoryName,
    categoryId,
    totalSkus: categorySkus.length,
    totalWeeklyUnits: totalUnits,
    averageMargin: avgMargin.toFixed(1) + '%',
    averageAvailability: avgAvailability.toFixed(1) + '%',
    statusDistribution: statusCounts,
    efficiencyDistribution: efficiencyCounts,
    topPerformers: categorySkus
      .sort((a, b) => b.weeklyUnitsSold - a.weeklyUnitsSold)
      .slice(0, 5)
      .map(s => ({ name: s.name, units: s.weeklyUnitsSold, margin: s.margin + '%' })),
    needsAttention: categorySkus
      .filter(s => s.engineSignals.length > 0 || s.availability < 80 || s.efficiency !== 'efficient')
      .slice(0, 5)
      .map(s => ({ name: s.name, issue: s.engineSignals.join(', ') || s.efficiency })),
  };
}

export function executeGetStatusDistribution(): object {
  return {
    distribution: UAE_SKU_STATUS_COUNTS,
    total: Object.values(UAE_SKU_STATUS_COUNTS).reduce((a, b) => a + b, 0),
    percentages: {
      active: ((UAE_SKU_STATUS_COUNTS.active / 162736) * 100).toFixed(1) + '%',
      onHold: ((UAE_SKU_STATUS_COUNTS['on-hold'] / 162736) * 100).toFixed(1) + '%',
      discontinued: ((UAE_SKU_STATUS_COUNTS.discontinued / 162736) * 100).toFixed(1) + '%',
      retired: ((UAE_SKU_STATUS_COUNTS.retired / 162736) * 100).toFixed(1) + '%',
    },
  };
}

export function executeGetWarehouseClusters(): object {
  return {
    clusters: WAREHOUSE_CLUSTERS.map(cluster => ({
      id: cluster.id,
      name: cluster.name,
      region: cluster.region,
      warehouseCount: cluster.warehouses.length,
      warehouses: cluster.warehouses,
    })),
    totalClusters: WAREHOUSE_CLUSTERS.length,
    totalWarehouses: WAREHOUSE_CLUSTERS.reduce((sum, c) => sum + c.warehouses.length, 0),
  };
}

// Main tool executor
export function executeTool(
  toolName: string,
  params: Record<string, unknown>,
  updateCallback?: (skuId: string, newStatus: SKUStatus, warehouses?: string[]) => boolean
): { result: unknown; error?: string } {
  try {
    switch (toolName) {
      case 'get_kpis':
        return { result: executeGetKpis() };

      case 'search_skus':
        return { result: executeSearchSkus(params as Parameters<typeof executeSearchSkus>[0]) };

      case 'get_sku_details':
        return { result: executeGetSkuDetails(params.skuId as string) };

      case 'update_sku_status':
        return { result: executeUpdateSkuStatus(params as Parameters<typeof executeUpdateSkuStatus>[0], updateCallback) };

      case 'get_engine_signals':
        return { result: executeGetEngineSignals(params as Parameters<typeof executeGetEngineSignals>[0]) };

      case 'analyze_category':
        return { result: executeAnalyzeCategory(params.category as string) };

      case 'get_status_distribution':
        return { result: executeGetStatusDistribution() };

      case 'get_warehouse_clusters':
        return { result: executeGetWarehouseClusters() };

      default:
        return { result: null, error: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    return {
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error executing tool',
    };
  }
}