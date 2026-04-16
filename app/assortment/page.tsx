'use client';

import { useState } from 'react';
import { AssortmentCard } from '@/components/AssortmentCard';
import { SAMPLE_ASSORTMENT_RECS } from '@/lib/sample-data';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuickActions } from '@/components/QuickActions';
import { useNotifications } from '@/lib/NotificationContext';

const SEGMENTS = [
  { key: 'missing', label: 'Missing SKUs', count: 23 },
  { key: 'underperforming', label: 'Underperforming', count: 8 },
  { key: 'oos-risk', label: 'OOS Risk', count: 5 },
];

// Additional sample recommendations
const ADDITIONAL_RECS = [
  {
    source: 'competitor' as const,
    skuName: 'Alpro Unsweetened Oat 1L',
    rationale: 'Available on Carrefour at AED 16.5. High search volume in plant-based category. Est. 400+ units/month.',
    confidence: 88,
  },
  {
    source: 'search' as const,
    skuName: 'Premium Greek Yogurt 500g',
    rationale: 'Search volume up 180% MoM. Zero organic listings. Price potential AED 22-28.',
    confidence: 75,
  },
  {
    source: 'nielsen' as const,
    skuName: 'Nestle A+ Milk 1L',
    rationale: 'Top 5 nationally by value in MT. Gap in availability on platform. Margin est. 25-30%.',
    confidence: 82,
  },
];

export default function AssortmentPage() {
  const [activeSegment, setActiveSegment] = useState('missing');
  const [acceptedSKUs, setAcceptedSKUs] = useState<string[]>([]);
  const { addNotification } = useNotifications();

  const allRecommendations = [...SAMPLE_ASSORTMENT_RECS, ...ADDITIONAL_RECS];

  const handleAdd = (skuName: string) => {
    setAcceptedSKUs([...acceptedSKUs, skuName]);
    addNotification({
      type: 'success',
      title: 'SKU Added to Pipeline',
      message: `${skuName} has been added to the assortment pipeline`,
      actionUrl: '/sku-tower',
      actionLabel: 'View in SKU Tower',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dh-blue">Assortment Recommendations</h1>
          <p className="text-gray-500 mt-1">
            Choice Engine • {allRecommendations.length} opportunities identified
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Missing vs Competitors</p>
          <p className="text-2xl font-bold text-dh-blue">23</p>
          <p className="text-xs text-amber-600 mt-1">Carrefour, Lulu, Noon</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">High Search Demand</p>
          <p className="text-2xl font-bold text-purple-600">12</p>
          <p className="text-xs text-gray-400 mt-1">Unmet search volume</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Est. Monthly Revenue</p>
          <p className="text-2xl font-bold text-green-600">AED 48K</p>
          <p className="text-xs text-gray-400 mt-1">If all recommendations added</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Avg Confidence</p>
          <p className="text-2xl font-bold text-dh-blue">84%</p>
          <p className="text-xs text-gray-400 mt-1">Across all recommendations</p>
        </Card>
      </div>

      {/* Segment Switcher */}
      <div className="flex gap-2">
        {SEGMENTS.map((segment) => {
          const isActive = activeSegment === segment.key;
          return (
            <button
              key={segment.key}
              onClick={() => setActiveSegment(segment.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                isActive
                  ? 'bg-dh-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {segment.label}
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {segment.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allRecommendations.map((rec, index) => (
          <AssortmentCard
            key={index}
            source={rec.source}
            skuName={rec.skuName}
            rationale={rec.rationale}
            confidence={rec.confidence}
            onAdd={() => handleAdd(rec.skuName)}
            isAccepted={acceptedSKUs.includes(rec.skuName)}
          />
        ))}
      </div>

      {/* Recently Added */}
      {acceptedSKUs.length > 0 && (
        <Card>
          <CardHeader title="Recently Accepted" subtitle={`${acceptedSKUs.length} SKUs added to pipeline`} />
          <div className="flex flex-wrap gap-2">
            {acceptedSKUs.map((sku) => (
              <Badge key={sku} variant="success" className="gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {sku}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}