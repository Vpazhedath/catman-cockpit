'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Sample lifecycle data
const LIFECYCLE_STAGES = [
  { stage: 'New', count: 24, color: 'bg-blue-500' },
  { stage: 'Active', count: 156, color: 'bg-green-500' },
  { stage: 'Review', count: 18, color: 'bg-amber-500' },
  { stage: 'Phase-out', count: 7, color: 'bg-red-500' },
];

const VELOCITY_DATA = [
  { sku: 'Almarai Full Cream 1L', current: 1240, previous: 1100, trend: '+13%', stage: 'active' },
  { sku: 'Lacnor Orange Juice 1L', current: 890, previous: 950, trend: '-6%', stage: 'review' },
  { sku: 'Nestle Pure Life 1.5L', current: 2100, previous: 1800, trend: '+17%', stage: 'active' },
  { sku: 'Barakat Fresh Milk 2L', current: 320, previous: 0, trend: 'NEW', stage: 'new' },
  { sku: 'Almarai Laban 200ml', current: 180, previous: 420, trend: '-57%', stage: 'phase-out' },
  { sku: 'Red Bull 250ml', current: 560, previous: 520, trend: '+8%', stage: 'active' },
];

const STAGE_TRANSITIONS = [
  { sku: 'Barakat Fresh Milk 2L', from: 'New', to: 'Active', date: '2024-01-18', auto: true },
  { sku: 'Almarai Laban 200ml', from: 'Review', to: 'Phase-out', date: '2024-01-16', auto: true },
  { sku: 'Sunkist Lemon 330ml', from: 'New', to: 'Active', date: '2024-01-14', auto: true },
  { sku: 'Lacnor Orange Juice 1L', from: 'Active', to: 'Review', date: '2024-01-12', auto: false },
];

export default function LifecyclePage() {
  const totalSKUs = LIFECYCLE_STAGES.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      {/* Stage Funnel */}
      <Card>
        <CardHeader title="SKU Lifecycle Funnel" subtitle={`${totalSKUs} total SKUs tracked`} />
        <div className="flex items-end justify-center gap-4 py-8">
          {LIFECYCLE_STAGES.map((stage, idx) => {
            const width = 280 - idx * 40;
            return (
              <div key={stage.stage} className="flex flex-col items-center">
                <div
                  className={`${stage.color} rounded-lg flex items-center justify-center text-white font-medium transition-all hover:scale-105`}
                  style={{ width: `${width}px`, height: '60px' }}
                >
                  {stage.count} SKUs
                </div>
                <p className="text-sm font-medium text-gray-600 mt-2">{stage.stage}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-8 pt-4 border-t border-gray-100">
          {LIFECYCLE_STAGES.map((stage) => (
            <div key={stage.stage} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
              <span className="text-sm text-gray-600">{stage.stage}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Velocity Trends */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100">
          <CardHeader
            title="Velocity Trends"
            subtitle="Units/week - comparing current vs previous period"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Current (units/wk)</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Previous</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {VELOCITY_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-dh-blue">{row.sku}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium">{row.current.toLocaleString()}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-500">{row.previous.toLocaleString()}</td>
                  <td className={`px-5 py-3 text-sm text-right font-medium ${
                    row.trend.startsWith('+') ? 'text-green-600' : row.trend.startsWith('-') ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {row.trend}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <StatusBadge status={row.stage as 'live' | 'new' | 'oos' | 'phase-out'} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Button size="sm" variant="ghost">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stage Transition Log */}
      <Card>
        <CardHeader
          title="Recent Stage Transitions"
          subtitle="Automated and manual stage changes"
        />
        <div className="space-y-3">
          {STAGE_TRANSITIONS.map((transition, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium text-dh-blue">{transition.sku}</span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Badge variant="default">{transition.from}</Badge>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <Badge variant="info">{transition.to}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">{transition.date}</span>
                {transition.auto ? (
                  <Badge variant="purple" size="sm">Auto</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Manual</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}