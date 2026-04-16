'use client';

import { KPICard } from "@/components/KPICard";
import { GMVChart } from "@/components/GMVChart";
import { EngineSignals } from "@/components/EngineSignals";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SAMPLE_KPIS } from "@/lib/sample-data";

// Additional trend data for sparklines
const TREND_DATA = [
  { label: 'Revenue Trend', data: [65, 72, 68, 80, 85, 78, 92], trend: '+18%' },
  { label: 'Order Volume', data: [120, 132, 128, 145, 138, 152, 168], trend: '+14%' },
  { label: 'Avg Order Value', data: [45, 48, 46, 52, 55, 53, 58], trend: '+8%' },
];

// Top performing SKUs
const TOP_SKUS = [
  { rank: 1, name: 'Nestle Pure Life 1.5L', orders: 2840, growth: '+24%' },
  { rank: 2, name: 'Almarai Full Cream 1L', orders: 2156, growth: '+18%' },
  { rank: 3, name: 'Coca-Cola 330ml Can', orders: 1890, growth: '+12%' },
  { rank: 4, name: 'Red Bull 250ml', orders: 1456, growth: '+31%' },
  { rank: 5, name: 'Lacnor Orange Juice 1L', orders: 1234, growth: '+8%' },
];

// Recent activity
const RECENT_ACTIVITY = [
  { action: 'Price updated', item: 'Almarai Full Cream 1L', time: '2 min ago', type: 'price' },
  { action: 'SKU added', item: 'Oat Milk 1L', time: '15 min ago', type: 'assortment' },
  { action: 'Promo started', item: 'Flash Sale - Beverages', time: '1 hour ago', type: 'promo' },
  { action: 'Stock alert', item: 'Nestle Pure Life 1.5L', time: '2 hours ago', type: 'alert' },
];

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_KPIS.map((kpi, index) => (
          <KPICard
            key={index}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            direction={kpi.direction}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      {/* Main Content - 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - GMV Chart */}
        <div className="lg:col-span-2">
          <GMVChart />
        </div>

        {/* Right - Engine Signals */}
        <div>
          <EngineSignals />
        </div>
      </div>

      {/* Bottom Section - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing SKUs */}
        <Card>
          <CardHeader title="Top Performing SKUs" subtitle="By order volume this week" />
          <div className="space-y-3">
            {TOP_SKUS.map((sku) => (
              <div key={sku.rank} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  sku.rank === 1 ? 'bg-amber-100 text-amber-700' :
                  sku.rank === 2 ? 'bg-gray-100 text-gray-600' :
                  sku.rank === 3 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {sku.rank}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-dh-blue">{sku.name}</p>
                  <p className="text-xs text-gray-500">{sku.orders.toLocaleString()} orders</p>
                </div>
                <Badge variant={sku.growth.startsWith('+') ? 'success' : 'danger'} size="sm">
                  {sku.growth}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Recent Activity" subtitle="Latest changes across all engines" />
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'price' ? 'bg-blue-100' :
                  activity.type === 'assortment' ? 'bg-green-100' :
                  activity.type === 'promo' ? 'bg-purple-100' :
                  'bg-amber-100'
                }`}>
                  {activity.type === 'price' && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                  {activity.type === 'assortment' && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {activity.type === 'promo' && (
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  )}
                  {activity.type === 'alert' && (
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.action}</span>
                    <span className="text-gray-500"> • {activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}