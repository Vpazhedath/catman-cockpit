'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SAMPLE_ENGINE_SIGNALS } from '@/lib/sample-data';
import Link from 'next/link';

// Engine configuration data
const ENGINE_CONFIGS = [
  {
    id: 'choice',
    name: 'Choice Engine',
    description: 'Assortment recommendations based on competitor signals, search trends, and Nielsen data',
    automation: 'Semi-automated',
    status: 'active',
    color: 'blue',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    metrics: [
      { label: 'Recommendations', value: '23' },
      { label: 'Avg Confidence', value: '85%' },
      { label: 'Last Run', value: '2h ago' },
    ],
    dataSources: ['Carrefour', 'Lulu', 'Noon', 'Nielsen', 'Google Trends'],
  },
  {
    id: 'lifecycle',
    name: 'SKU Lifecycle Engine',
    description: 'Automated SKU stage management from New → Active → Review → Phase-out',
    automation: 'Fully automated',
    status: 'active',
    color: 'purple',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    metrics: [
      { label: 'SKUs Monitored', value: '205' },
      { label: 'Actions Pending', value: '8' },
      { label: 'Auto-Updated', value: 'Today' },
    ],
    dataSources: ['Internal Sales', 'Inventory', 'Catalog'],
  },
  {
    id: 'affordability',
    name: 'Affordability Engine',
    description: 'Price matching and promo recommendations based on competitor price signals',
    automation: 'Fully automated',
    status: 'active',
    color: 'amber',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    metrics: [
      { label: 'Price Alerts', value: '14' },
      { label: 'Promo Opps', value: '3' },
      { label: 'Last Run', value: '4h ago' },
    ],
    dataSources: ['Carrefour', 'Lulu', 'Noon', 'Amazon'],
  },
  {
    id: 'profitability',
    name: 'Profitability Engine',
    description: 'Supplier scorecards, margin analysis, and renegotiation opportunities',
    automation: 'Semi-automated',
    status: 'active',
    color: 'green',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    metrics: [
      { label: 'Suppliers', value: '24' },
      { label: 'Renegotiation Flags', value: '3' },
      { label: 'Last Run', value: 'Daily' },
    ],
    dataSources: ['Supplier Portal', 'Finance', 'Procurement'],
  },
];

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
};

export default function EnginesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dh-blue">Intelligence Engines</h1>
          <p className="text-gray-500 mt-1">Automated decision support systems for category management</p>
        </div>
        <Button variant="secondary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configure Engines
        </Button>
      </div>

      {/* Engine Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ENGINE_CONFIGS.map(engine => {
          const colors = colorClasses[engine.color as keyof typeof colorClasses];
          return (
            <Card key={engine.id} className={`border-l-4 ${colors.border}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <div className={colors.text}>{engine.icon}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-dh-blue">{engine.name}</h3>
                    <Badge variant={engine.automation === 'Fully automated' ? 'success' : 'info'} size="sm">
                      {engine.automation}
                    </Badge>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <p className="text-sm text-gray-600 mb-4">{engine.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {engine.metrics.map(metric => (
                  <div key={metric.label} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-dh-blue">{metric.value}</p>
                    <p className="text-xs text-gray-500">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* Data Sources */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Data Sources</p>
                <div className="flex flex-wrap gap-1">
                  {engine.dataSources.map(source => (
                    <span key={source} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                      {source}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link href={`/${engine.id === 'choice' ? 'assortment' : engine.id === 'affordability' ? 'price' : engine.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
                <Button variant="ghost" size="sm">
                  Run Now
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Signal Summary */}
      <Card>
        <CardHeader title="Active Signals" subtitle="Current alerts from all engines" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_ENGINE_SIGNALS.map((signal, idx) => {
            const colors = {
              choice: colorClasses.blue,
              affordability: colorClasses.amber,
              lifecycle: colorClasses.purple,
              profitability: colorClasses.green,
            };
            const signalColors = colors[signal.engine as keyof typeof colors];
            return (
              <div key={idx} className={`p-4 rounded-lg ${signalColors.bg} ${signalColors.border} border`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${signalColors.text.replace('text-', 'bg-')}`}></div>
                  <span className={`text-xs font-medium ${signalColors.text} capitalize`}>
                    {signal.engine}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{signal.message}</p>
                <Link href={`/${signal.ctaTab}`} className={`text-xs font-medium ${signalColors.text} hover:underline`}>
                  {signal.ctaLabel}
                </Link>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}