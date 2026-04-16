'use client';

import { useMemo, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  SKULifecycleEngine,
  SAMPLE_LIFECYCLE_SKUS,
  type SKULifecycleState,
  type SKUMaturityStage,
  type SKUEfficiency,
  LIFECYCLE_THRESHOLDS,
} from '@/lib/lifecycle-engine';

// Stage colors
const STAGE_COLORS: Record<SKUMaturityStage, string> = {
  new: 'bg-blue-500',
  probation: 'bg-purple-500',
  mature: 'bg-green-500',
  review: 'bg-amber-500',
  'phase-out': 'bg-red-500',
};

const EFFICIENCY_COLORS: Record<SKUEfficiency, string> = {
  efficient: 'text-green-600',
  'slow-mover': 'text-amber-600',
  'zero-mover': 'text-red-600',
  'low-availability': 'text-orange-600',
};

export default function LifecyclePage() {
  const [selectedStage, setSelectedStage] = useState<SKUMaturityStage | 'all'>('all');
  const [selectedEfficiency, setSelectedEfficiency] = useState<SKUEfficiency | 'all'>('all');

  // Process SKUs through lifecycle engine
  const processedSKUs = useMemo(() => {
    return SKULifecycleEngine.processSKUBatch(SAMPLE_LIFECYCLE_SKUS);
  }, []);

  // Calculate stage counts
  const stageCounts = useMemo(() => {
    const counts: Record<SKUMaturityStage, number> = {
      new: 0,
      probation: 0,
      mature: 0,
      review: 0,
      'phase-out': 0,
    };
    processedSKUs.forEach(sku => {
      counts[sku.maturityStage]++;
    });
    return counts;
  }, [processedSKUs]);

  // Calculate efficiency counts
  const efficiencyCounts = useMemo(() => {
    const counts: Record<SKUEfficiency, number> = {
      efficient: 0,
      'slow-mover': 0,
      'zero-mover': 0,
      'low-availability': 0,
    };
    processedSKUs.forEach(sku => {
      counts[sku.efficiency]++;
    });
    return counts;
  }, [processedSKUs]);

  // Count recommendations
  const recommendationCount = processedSKUs.filter(sku => sku.recommendedAction).length;

  // Filter SKUs
  const filteredSKUs = processedSKUs.filter(sku => {
    if (selectedStage !== 'all' && sku.maturityStage !== selectedStage) return false;
    if (selectedEfficiency !== 'all' && sku.efficiency !== selectedEfficiency) return false;
    return true;
  });

  const totalSKUs = processedSKUs.length;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Total SKUs</p>
          <p className="text-2xl font-bold text-dh-blue">{totalSKUs}</p>
          <p className="text-xs text-gray-400 mt-1">Across all lifecycle stages</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">New SKUs (≤30 days)</p>
          <p className="text-2xl font-bold text-blue-600">{stageCounts.new}</p>
          <p className="text-xs text-gray-400 mt-1">In launch period</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Non-performing</p>
          <p className="text-2xl font-bold text-red-600">
            {efficiencyCounts['zero-mover'] + efficiencyCounts['slow-mover']}
          </p>
          <p className="text-xs text-gray-400 mt-1">Zero/Slow movers</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Actions Required</p>
          <p className="text-2xl font-bold text-amber-600">{recommendationCount}</p>
          <p className="text-xs text-gray-400 mt-1">Recommendations pending</p>
        </Card>
      </div>

      {/* Lifecycle Funnel */}
      <Card>
        <CardHeader
          title="SKU Lifecycle Funnel"
          subtitle={`${totalSKUs} SKUs across maturity stages`}
        />
        <div className="flex items-end justify-center gap-6 py-8">
          {(['new', 'probation', 'mature', 'review', 'phase-out'] as SKUMaturityStage[]).map((stage, idx) => {
            const count = stageCounts[stage];
            const width = 260 - idx * 35;
            const labels: Record<SKUMaturityStage, string> = {
              new: 'New',
              probation: 'Probation',
              mature: 'Mature',
              review: 'Review',
              'phase-out': 'Phase-out',
            };
            return (
              <div key={stage} className="flex flex-col items-center cursor-pointer group"
                   onClick={() => setSelectedStage(selectedStage === stage ? 'all' : stage)}>
                <div
                  className={`${STAGE_COLORS[stage]} rounded-lg flex items-center justify-center text-white font-medium transition-all group-hover:scale-105 ${selectedStage === stage ? 'ring-2 ring-offset-2 ring-dh-red' : ''}`}
                  style={{ width: `${width}px`, height: '55px' }}
                >
                  {count} SKUs
                </div>
                <p className="text-sm font-medium text-gray-600 mt-2">{labels[stage]}</p>
                <p className="text-xs text-gray-400">
                  {stage === 'new' ? '0-30 days' :
                   stage === 'probation' ? '31-90 days' :
                   stage === 'mature' ? '>90 days' :
                   stage === 'review' ? 'Action needed' : 'Discontinued'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Efficiency Distribution & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Efficiency Distribution */}
        <Card>
          <CardHeader title="Efficiency Distribution" subtitle="By sales velocity" />
          <div className="space-y-4">
            {(['efficient', 'slow-mover', 'zero-mover', 'low-availability'] as SKUEfficiency[]).map(efficiency => {
              const count = efficiencyCounts[efficiency];
              const percentage = (count / totalSKUs) * 100;
              const labels: Record<SKUEfficiency, string> = {
                efficient: 'Efficient (>1 unit/wk)',
                'slow-mover': 'Slow Mover (<1 unit/wk)',
                'zero-mover': 'Zero Mover (0 units)',
                'low-availability': 'Low Availability (<80%)',
              };
              const colors: Record<SKUEfficiency, string> = {
                efficient: 'bg-green-500',
                'slow-mover': 'bg-amber-500',
                'zero-mover': 'bg-red-500',
                'low-availability': 'bg-orange-500',
              };

              return (
                <div
                  key={efficiency}
                  className="cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setSelectedEfficiency(selectedEfficiency === efficiency ? 'all' : efficiency)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${EFFICIENCY_COLORS[efficiency]}`}>
                      {labels[efficiency]}
                    </span>
                    <span className="text-sm text-gray-500">{count} SKUs ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[efficiency]} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Active Recommendations */}
        <Card>
          <CardHeader
            title="Active Recommendations"
            subtitle={`${recommendationCount} actions pending`}
          />
          <div className="space-y-3">
            {processedSKUs.filter(sku => sku.recommendedAction).slice(0, 5).map(sku => (
              <div key={sku.skuId} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-dh-blue text-sm">{sku.name}</p>
                    <p className="text-xs text-gray-500">{sku.category} • {sku.supplier}</p>
                  </div>
                  <Badge
                    variant={sku.recommendedAction?.priority === 'high' ? 'danger' :
                            sku.recommendedAction?.priority === 'medium' ? 'warning' : 'default'}
                    size="sm"
                  >
                    {sku.recommendedAction?.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{sku.recommendedAction?.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Impact: {sku.recommendedAction?.estimatedImpact}
                  </span>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
              </div>
            ))}
            {recommendationCount === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No recommendations at this time</p>
                <p className="text-xs mt-1">All SKUs are performing well</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* SKU Lifecycle Table */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100">
          <CardHeader title="SKU Lifecycle Details" subtitle="All SKUs with lifecycle metrics" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Units/Wk</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Avail%</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">DOH</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Shrink%</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSKUs.map(sku => (
                <tr key={sku.skuId} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-dh-blue">{sku.name}</p>
                    <p className="text-xs text-gray-500">{sku.category}</p>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${STAGE_COLORS[sku.maturityStage]}`}>
                      {sku.maturityStage}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-sm font-medium ${EFFICIENCY_COLORS[sku.efficiency]}`}>
                      {sku.efficiency}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-gray-600">{sku.daysInAssortment}</td>
                  <td className="px-5 py-3 text-right text-sm font-medium">{sku.weeklyUnitsSold}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm ${sku.availability >= 90 ? 'text-green-600' : sku.availability >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                      {sku.availability}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm ${sku.daysOnHand <= LIFECYCLE_THRESHOLDS.targetDaysOnHand ? 'text-green-600' : sku.daysOnHand <= LIFECYCLE_THRESHOLDS.warningDaysOnHand ? 'text-amber-600' : 'text-red-600'}`}>
                      {sku.daysOnHand}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm ${sku.shrinkage <= 10 ? 'text-green-600' : sku.shrinkage <= 20 ? 'text-amber-600' : 'text-red-600'}`}>
                      {sku.shrinkage}%
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {sku.recommendedAction ? (
                      <Button size="sm" variant="outline">
                        {sku.recommendedAction.type === 'discontinue' ? 'Discontinue' :
                         sku.recommendedAction.type === 'clearance' ? `Clear ${sku.clearanceDiscount}%` :
                         sku.recommendedAction.type === 'status-on-hold' ? 'Hold' :
                         sku.recommendedAction.type === 'range-expansion' ? 'Expand' : 'Review'}
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}