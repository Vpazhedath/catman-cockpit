'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Sample competitor price data
const COMPETITOR_PRICES = [
  { sku: 'Almarai Full Cream 1L', ourPrice: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75, gap: '+3%', status: 'competitive' },
  { sku: 'Lacnor Orange Juice 1L', ourPrice: 6.00, carrefour: 5.50, lulu: 5.75, noon: 6.25, gap: '+9%', status: 'high' },
  { sku: 'Nestle Pure Life 1.5L', ourPrice: 2.00, carrefour: 1.75, lulu: 1.85, noon: 2.10, gap: '+14%', status: 'high' },
  { sku: 'Coca-Cola 330ml Can', ourPrice: 3.25, carrefour: 3.50, lulu: 3.25, noon: 3.50, gap: '-7%', status: 'low' },
  { sku: 'Red Bull 250ml', ourPrice: 7.00, carrefour: 6.50, lulu: 6.75, noon: 7.25, gap: '+8%', status: 'high' },
  { sku: 'Barakat Fresh Milk 2L', ourPrice: 11.00, carrefour: 10.50, lulu: 11.00, noon: 11.50, gap: '+5%', status: 'competitive' },
];

const PROMO_RECOMMENDATIONS = [
  { sku: 'Lacnor Orange Juice 1L', type: 'Price Match', suggested: 'AED 5.50', reason: '9% above Carrefour', impact: 'Est. +320 orders/week' },
  { sku: 'Nestle Pure Life 1.5L', type: 'Flash Sale', suggested: 'AED 1.75 (-13%)', reason: '14% above market avg', impact: 'Est. +580 orders/week' },
  { sku: 'Red Bull 250ml', type: 'Bundle Deal', suggested: '3 for AED 18', reason: 'High margin, competitive gap', impact: 'Est. +210 orders/week' },
];

export default function PricePage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Price Competitiveness</p>
          <p className="text-2xl font-bold text-dh-blue">72%</p>
          <p className="text-sm text-amber-600 mt-1">14 SKUs above market</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Avg Price Gap</p>
          <p className="text-2xl font-bold text-dh-blue">+4.2%</p>
          <p className="text-sm text-red-600 mt-1">vs competitor avg</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Promo Opportunities</p>
          <p className="text-2xl font-bold text-dh-blue">3</p>
          <p className="text-sm text-dh-green mt-1">High impact recommendations</p>
        </Card>
      </div>

      {/* Competitor Price Comparison */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100">
          <CardHeader
            title="Competitor Price Comparison"
            subtitle="Last updated: Today, 09:45 AM"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">SKU</th>
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
              {COMPETITOR_PRICES.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-dh-blue">{row.sku}</td>
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
                    <Badge
                      variant={row.status === 'low' ? 'success' : row.status === 'high' ? 'danger' : 'info'}
                    >
                      {row.status === 'low' ? 'Below market' : row.status === 'high' ? 'Above market' : 'Competitive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {row.status === 'high' && (
                      <Button size="sm" variant="outline">Match Price</Button>
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
        <CardHeader title="Promo Recommendations" subtitle="Affordability Engine suggestions" />
        <div className="space-y-3">
          {PROMO_RECOMMENDATIONS.map((promo, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-dh-blue">{promo.sku}</span>
                  <Badge variant="purple">{promo.type}</Badge>
                </div>
                <p className="text-sm text-gray-500">{promo.reason}</p>
              </div>
              <div className="text-right mr-6">
                <p className="font-medium text-dh-blue">{promo.suggested}</p>
                <p className="text-xs text-dh-green">{promo.impact}</p>
              </div>
              <Button size="sm">Apply</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}