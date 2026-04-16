'use client';

import { useState } from 'react';
import { AssortmentCard } from '@/components/AssortmentCard';
import { SAMPLE_ASSORTMENT_RECS } from '@/lib/sample-data';

const SEGMENTS = [
  { key: 'missing', label: 'Missing SKUs' },
  { key: 'underperforming', label: 'Underperforming' },
  { key: 'oos-risk', label: 'OOS Risk' },
];

export default function AssortmentPage() {
  const [activeSegment, setActiveSegment] = useState('missing');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-dh-blue">
            {SAMPLE_ASSORTMENT_RECS.length} assortment opportunities
          </h2>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Segment Switcher */}
      <div className="flex gap-2">
        {SEGMENTS.map((segment) => {
          const isActive = activeSegment === segment.key;
          return (
            <button
              key={segment.key}
              onClick={() => setActiveSegment(segment.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-dh-blue text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {segment.label}
            </button>
          );
        })}
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SAMPLE_ASSORTMENT_RECS.map((rec, index) => (
          <AssortmentCard
            key={index}
            source={rec.source}
            skuName={rec.skuName}
            rationale={rec.rationale}
            confidence={rec.confidence}
            onAdd={() => console.log(`Adding ${rec.skuName} to assortment`)}
          />
        ))}
      </div>
    </div>
  );
}