'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Mock analytics data
const PERFORMANCE_METRICS = [
  { metric: 'GMV', current: 'AED 2.4M', previous: 'AED 2.1M', change: '+14%', trend: 'up' },
  { metric: 'Orders', current: '18,420', previous: '16,890', change: '+9%', trend: 'up' },
  { metric: 'Avg Basket', current: 'AED 130', previous: 'AED 125', change: '+4%', trend: 'up' },
  { metric: 'SKU Count', current: '205', previous: '198', change: '+4%', trend: 'up' },
];

const ENGINE_PERFORMANCE = [
  { engine: 'Choice Engine', recommendations: 23, accepted: 18, acceptanceRate: '78%', avgConfidence: '85%' },
  { engine: 'Lifecycle Engine', recommendations: 8, accepted: 6, acceptanceRate: '75%', avgConfidence: '92%' },
  { engine: 'Affordability Engine', recommendations: 14, accepted: 10, acceptanceRate: '71%', avgConfidence: '88%' },
  { engine: 'Profitability Engine', recommendations: 3, accepted: 2, acceptanceRate: '67%', avgConfidence: '82%' },
];

const TOP_CATEGORIES = [
  { category: 'Dairy', skus: 45, revenue: 'AED 420K', growth: '+12%' },
  { category: 'Beverages', skus: 38, revenue: 'AED 380K', growth: '+8%' },
  { category: 'Water', skus: 22, revenue: 'AED 180K', growth: '+15%' },
  { category: 'Energy Drinks', skus: 15, revenue: 'AED 145K', growth: '+22%' },
  { category: 'Juices', skus: 28, revenue: 'AED 120K', growth: '-3%' },
];

const RECENT_ACTIONS = [
  { action: 'SKU Discontinued', item: 'Almarai Laban 200ml', user: 'System', time: '10 min ago' },
  { action: 'Price Matched', item: 'Lacnor Orange Juice 1L', user: 'Ahmed K.', time: '25 min ago' },
  { action: 'Clearance Started', item: 'Premium Yogurt 500g', user: 'Sara M.', time: '1 hour ago' },
  { action: 'SKU Added', item: 'Oat Milk 1L', user: 'Mohammed R.', time: '2 hours ago' },
  { action: 'Status Changed', item: 'Nestle Pure Life 1.5L', user: 'System', time: '3 hours ago' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dh-blue">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Performance insights and engine metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </Button>
          <Button>Share</Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {PERFORMANCE_METRICS.map((metric) => (
          <Card key={metric.metric}>
            <p className="text-sm text-gray-500">{metric.metric}</p>
            <p className="text-2xl font-bold text-dh-blue mt-1">{metric.current}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
              <span className="text-xs text-gray-400">vs last period</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engine Performance */}
        <Card className="lg:col-span-2">
          <CardHeader title="Engine Performance" subtitle="Recommendation acceptance rates" />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Engine</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Recommendations</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Accepted</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Acceptance</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ENGINE_PERFORMANCE.map((engine) => (
                  <tr key={engine.engine} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-dh-blue">{engine.engine}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">{engine.recommendations}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-600">{engine.accepted}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={parseInt(engine.acceptanceRate) >= 70 ? 'success' : 'warning'}>
                        {engine.acceptanceRate}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-medium text-dh-blue">{engine.avgConfidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader title="Top Categories" subtitle="By revenue this period" />
          <div className="space-y-3">
            {TOP_CATEGORIES.map((cat, idx) => (
              <div key={cat.category} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{cat.category}</p>
                  <p className="text-xs text-gray-400">{cat.skus} SKUs</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-dh-blue">{cat.revenue}</p>
                  <p className={`text-xs ${cat.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {cat.growth}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Actions */}
      <Card>
        <CardHeader title="Recent Actions" subtitle="Latest system and user activities" />
        <div className="space-y-2">
          {RECENT_ACTIONS.map((action, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                action.action.includes('Discontinued') ? 'bg-red-100' :
                action.action.includes('Added') ? 'bg-green-100' :
                action.action.includes('Clearance') ? 'bg-amber-100' :
                'bg-blue-100'
              }`}>
                <svg className={`w-4 h-4 ${
                  action.action.includes('Discontinued') ? 'text-red-600' :
                  action.action.includes('Added') ? 'text-green-600' :
                  action.action.includes('Clearance') ? 'text-amber-600' :
                  'text-blue-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {action.action.includes('Discontinued') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : action.action.includes('Added') ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  )}
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{action.action}</span>
                  <span className="text-gray-400"> • {action.item}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {action.user} • {action.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}