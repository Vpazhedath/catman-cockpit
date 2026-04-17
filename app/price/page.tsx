'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuickActions } from '@/components/QuickActions';
import { ExportModal } from '@/components/modals/ExportModal';
import { useNotifications } from '@/lib/NotificationContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Sample competitor price data
const COMPETITOR_PRICES = [
  { sku: 'Almarai Full Cream 1L', ourPrice: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75, gap: '+3%', status: 'competitive', category: 'Dairy' },
  { sku: 'Lacnor Orange Juice 1L', ourPrice: 6.00, carrefour: 5.50, lulu: 5.75, noon: 6.25, gap: '+9%', status: 'high', category: 'Juices' },
  { sku: 'Nestle Pure Life 1.5L', ourPrice: 2.00, carrefour: 1.75, lulu: 1.85, noon: 2.10, gap: '+14%', status: 'high', category: 'Water' },
  { sku: 'Coca-Cola 330ml Can', ourPrice: 3.25, carrefour: 3.50, lulu: 3.25, noon: 3.50, gap: '-7%', status: 'low', category: 'Carbonated' },
  { sku: 'Red Bull 250ml', ourPrice: 7.00, carrefour: 6.50, lulu: 6.75, noon: 7.25, gap: '+8%', status: 'high', category: 'Energy' },
  { sku: 'Barakat Fresh Milk 2L', ourPrice: 11.00, carrefour: 10.50, lulu: 11.00, noon: 11.50, gap: '+5%', status: 'competitive', category: 'Dairy' },
  { sku: 'Almarai Laban 200ml', ourPrice: 1.80, carrefour: 1.75, lulu: 1.80, noon: 1.90, gap: '+3%', status: 'competitive', category: 'Dairy' },
  { sku: 'Sunkist Lemon 330ml', ourPrice: 3.50, carrefour: 3.25, lulu: 3.50, noon: 3.75, gap: '+8%', status: 'high', category: 'Carbonated' },
];

const PROMO_RECOMMENDATIONS = [
  { sku: 'Lacnor Orange Juice 1L', type: 'Price Match', suggested: 'AED 5.50', reason: '9% above Carrefour', impact: 'Est. +320 orders/week', confidence: 92 },
  { sku: 'Nestle Pure Life 1.5L', type: 'Flash Sale', suggested: 'AED 1.75 (-13%)', reason: '14% above market avg', impact: 'Est. +580 orders/week', confidence: 88 },
  { sku: 'Red Bull 250ml', type: 'Bundle Deal', suggested: '3 for AED 18', reason: 'High margin, competitive gap', impact: 'Est. +210 orders/week', confidence: 85 },
  { sku: 'Sunkist Lemon 330ml', type: 'Price Match', suggested: 'AED 3.25', reason: '8% above Carrefour', impact: 'Est. +150 orders/week', confidence: 78 },
];

// Price history data
const PRICE_HISTORY = [
  { date: 'Mon', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
  { date: 'Tue', our: 7.50, carrefour: 7.25, lulu: 7.45, noon: 7.75 },
  { date: 'Wed', our: 7.50, carrefour: 7.20, lulu: 7.45, noon: 7.70 },
  { date: 'Thu', our: 7.50, carrefour: 7.20, lulu: 7.50, noon: 7.70 },
  { date: 'Fri', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
  { date: 'Sat', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
  { date: 'Sun', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
];

export default function PricePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'high' | 'low' | 'competitive'>('all');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [appliedPromos, setAppliedPromos] = useState<string[]>([]);
  const { addNotification } = useNotifications();

  const categories = ['all', ...new Set(COMPETITOR_PRICES.map(p => p.category))];

  const filteredPrices = COMPETITOR_PRICES.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (priceFilter !== 'all' && p.status !== priceFilter) return false;
    return true;
  });

  const stats = {
    competitive: COMPETITOR_PRICES.filter(p => p.status === 'competitive').length,
    high: COMPETITOR_PRICES.filter(p => p.status === 'high').length,
    low: COMPETITOR_PRICES.filter(p => p.status === 'low').length,
  };

  const handleApplyPromo = (sku: string) => {
    setAppliedPromos([...appliedPromos, sku]);
    addNotification({
      type: 'success',
      title: 'Promo Applied',
      message: `Promo for ${sku} has been scheduled`,
    });
  };

  const handleMatchPrice = (sku: string) => {
    addNotification({
      type: 'success',
      title: 'Price Matched',
      message: `${sku} price has been updated to match competitor`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dh-blue">Price & Promo</h1>
          <p className="text-gray-500 mt-1">Affordability Engine • Competitor monitoring & promo recommendations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <QuickActions />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Price Competitiveness</p>
          <p className="text-2xl font-bold text-dh-blue">72%</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-dh-green rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{stats.competitive} of {COMPETITOR_PRICES.length} SKUs competitive</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Avg Price Gap</p>
          <p className="text-2xl font-bold text-red-600">+4.2%</p>
          <p className="text-sm text-gray-500 mt-1">vs competitor avg</p>
          <p className="text-xs text-green-600 mt-1">↓ 0.8% from last week</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Above Market</p>
          <p className="text-2xl font-bold text-amber-600">{stats.high}</p>
          <p className="text-sm text-gray-500 mt-1">SKUs priced high</p>
          <p className="text-xs text-amber-600 mt-1">Est. AED 12K lost revenue/week</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Promo Opportunities</p>
          <p className="text-2xl font-bold text-purple-600">{PROMO_RECOMMENDATIONS.length}</p>
          <p className="text-sm text-gray-500 mt-1">High impact</p>
          <p className="text-xs text-dh-green mt-1">Est. +1,260 orders/week</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dh-red"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {(['all', 'high', 'competitive', 'low'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setPriceFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                priceFilter === filter ? 'bg-dh-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'high' ? 'Above Market' : filter === 'low' ? 'Below Market' : 'Competitive'}
              {filter !== 'all' && <span className="ml-1 opacity-60">({stats[filter as keyof typeof stats]})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Price History Chart */}
      <Card>
        <CardHeader title="Price History: Almarai Full Cream 1L" subtitle="Last 7 days competitor tracking" />
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PRICE_HISTORY}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip
                formatter={(value) => typeof value === 'number' ? `AED ${value.toFixed(2)}` : value}
                contentStyle={{ backgroundColor: '#131732', border: 'none', borderRadius: '8px', color: 'white' }}
              />
              <Legend />
              <Line type="monotone" dataKey="our" stroke="#D61F26" strokeWidth={2} dot={{ fill: '#D61F26' }} name="Our Price" />
              <Line type="monotone" dataKey="carrefour" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Carrefour" />
              <Line type="monotone" dataKey="lulu" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Lulu" />
              <Line type="monotone" dataKey="noon" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Noon" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Competitor Price Comparison */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <CardHeader title="Competitor Price Comparison" subtitle={`Last updated: Today, ${new Date().toLocaleTimeString()}`} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Our Price</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Carrefour</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Lulu</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Noon</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Gap</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPrices.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-dh-blue">{row.sku}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{row.category}</td>
                  <td className="px-5 py-3 text-sm text-right font-medium">AED {row.ourPrice.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">AED {row.carrefour.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">AED {row.lulu.toFixed(2)}</td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">AED {row.noon.toFixed(2)}</td>
                  <td className={`px-5 py-3 text-sm text-right font-medium ${
                    row.gap.startsWith('+') ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {row.gap}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <Badge variant={row.status === 'low' ? 'success' : row.status === 'high' ? 'danger' : 'info'}>
                      {row.status === 'low' ? 'Below market' : row.status === 'high' ? 'Above market' : 'Competitive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {row.status === 'high' && (
                      <Button size="sm" variant="outline" onClick={() => handleMatchPrice(row.sku)}>Match</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Promo Recommendations */}
      <Card>
        <CardHeader title="Promo Recommendations" subtitle={`${PROMO_RECOMMENDATIONS.length} suggestions from Affordability Engine`} />
        <div className="space-y-3">
          {PROMO_RECOMMENDATIONS.map((promo, idx) => (
            <div key={idx} className={`border rounded-lg p-4 flex items-center justify-between ${appliedPromos.includes(promo.sku) ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-dh-blue">{promo.sku}</span>
                  <Badge variant="purple">{promo.type}</Badge>
                  {appliedPromos.includes(promo.sku) && (
                    <Badge variant="success">Applied</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{promo.reason}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400">Confidence: {promo.confidence}%</span>
                </div>
              </div>
              <div className="text-right mr-6">
                <p className="font-medium text-dh-blue">{promo.suggested}</p>
                <p className="text-xs text-dh-green">{promo.impact}</p>
              </div>
              <Button
                size="sm"
                disabled={appliedPromos.includes(promo.sku)}
                onClick={() => handleApplyPromo(promo.sku)}
              >
                {appliedPromos.includes(promo.sku) ? 'Applied' : 'Apply'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dataTitle="Price & Competitor Data"
      />
    </div>
  );
}