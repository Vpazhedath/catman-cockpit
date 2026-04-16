import { NextResponse } from 'next/server';
import {
  SKULifecycleEngine,
  SAMPLE_LIFECYCLE_SKUS,
} from '@/lib/lifecycle-engine';

export async function GET() {
  // Process SKUs through the lifecycle engine
  const processedSKUs = SKULifecycleEngine.processSKUBatch(SAMPLE_LIFECYCLE_SKUS);

  // Extract recommendations
  const recommendations = processedSKUs
    .filter(sku => sku.recommendedAction)
    .map(sku => ({
      skuId: sku.skuId,
      name: sku.name,
      category: sku.category,
      efficiency: sku.efficiency,
      action: sku.recommendedAction,
      clearanceDiscount: sku.clearanceDiscount,
    }))
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.action!.priority] - priorityOrder[b.action!.priority];
    });

  return NextResponse.json({
    total: recommendations.length,
    recommendations,
  });
}