'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Sample supplier data
const SUPPLIER_SCORECARD = [
  { supplier: 'Almarai', skus: 12, avgMargin: 31, volume: 45000, rating: 'A', trend: 'up' },
  { supplier: 'Lacnor', skus: 8, avgMargin: 37, volume: 28000, rating: 'A', trend: 'up' },
  { supplier: 'Nestle', skus: 15, avgMargin: 28, volume: 52000, rating: 'B', trend: 'stable' },
  { supplier: 'Coca-Cola', skus: 10, avgMargin: 41, volume: 38000, rating: 'A', trend: 'up' },
  { supplier: 'Barakat', skus: 6, avgMargin: 25, volume: 15000, rating: 'B', trend: 'down' },
  { supplier: 'Red Bull', skus: 4, avgMargin: 35, volume: 12000, rating: 'A', trend: 'stable' },
];

const MARGINS_BY_CATEGORY = [
  { category: 'Dairy', margin: 32, contribution: 125000 },
  { category: 'Juices', margin: 28, contribution: 45000 },
  { category: 'Water', margin: 45, contribution: 38000 },
  { category: 'Carbonated', margin: 41, contribution: 62000 },
  { category: 'Energy drinks', margin: 35, contribution: 28000 },
];

const RENEGOTIATION_FLAGS = [
  { supplier: 'Nestle', issue: 'Margin below 30%', currentMargin: 28, targetMargin: 32, potentialGain: 'AED 18,400/mo' },
  { supplier: 'Barakat', issue: 'Declining volume trend', currentMargin: 25, targetMargin: 30, potentialGain: 'AED 7,500/mo' },
  { supplier: 'Lacnor', issue: 'Contract renewal due', currentMargin: 37, targetMargin: 40, potentialGain: 'AED 8,400/mo' },
];

export default function ProfitabilityPage() {
  const totalContribution = MARGINS_BY_CATEGORY.reduce((sum, c) => sum + c.contribution, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Avg Margin</p>
          <p className="text-2xl font-bold text-dh-blue">34.2%</p>
          <p className="text-sm text-green-600 mt-1">+2.1% vs last month</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Total Contribution</p>
          <p className="text-2xl font-bold text-dh-blue">AED {(totalContribution / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Active Suppliers</p>
          <p className="text-2xl font-bold text-dh-blue">6</p>
          <p className="text-sm text-gray-500 mt-1">Across 55 SKUs</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Renegotiation Ops</p>
          <p className="text-2xl font-bold text-dh-red">3</p>
          <p className="text-sm text-dh-green mt-1">AED 34.3K potential</p>
        </Card>
      </div>

      {/* Supplier Scorecard */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100">
          <CardHeader title="Supplier Scorecard" subtitle="Performance by supplier" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">SKUs</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Avg Margin</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Volume (units/mo)</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SUPPLIER_SCORECARD.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-dh-blue">{row.supplier}</td>
                  <td className="px-5 py-3 text-sm text-center text-gray-600">{row.skus}</td>
                  <td className={`px-5 py-3 text-sm text-right font-medium ${
                    row.avgMargin >= 35 ? 'text-green-600' : row.avgMargin >= 30 ? 'text-dh-blue' : 'text-amber-600'
                  }`}>
                    {row.avgMargin}%
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">{row.volume.toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      row.rating === 'A' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.rating}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {row.trend === 'up' ? (
                      <svg className="w-4 h-4 text-green-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : row.trend === 'down' ? (
                      <svg className="w-4 h-4 text-red-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Margin by Category & Renegotiation Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Waterfall */}
        <Card>
          <CardHeader title="Margin by Category" subtitle="Contribution breakdown" />
          <div className="space-y-3">
            {MARGINS_BY_CATEGORY.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{cat.category}</div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-dh-green rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${cat.margin}%` }}
                    >
                      <span className="text-xs font-medium text-dh-blue">{cat.margin}%</span>
                    </div>
                  </div>
                </div>
                <div className="w-24 text-right text-sm text-gray-500">
                  AED {(cat.contribution / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Renegotiation Flags */}
        <Card>
          <CardHeader
            title="Renegotiation Opportunities"
            subtitle="Profitability Engine flags"
          />
          <div className="space-y-3">
            {RENEGOTIATION_FLAGS.map((flag, idx) => (
              <div key={idx} className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-medium text-dh-blue">{flag.supplier}</span>
                    <p className="text-sm text-gray-600 mt-0.5">{flag.issue}</p>
                  </div>
                  <Badge variant="warning">Action needed</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Margin: <span className="text-dh-blue font-medium">{flag.currentMargin}%</span> → <span className="text-green-600 font-medium">{flag.targetMargin}%</span>
                  </span>
                  <span className="text-dh-green font-medium">{flag.potentialGain}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm">Start Negotiation</Button>
                  <Button size="sm" variant="ghost">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}