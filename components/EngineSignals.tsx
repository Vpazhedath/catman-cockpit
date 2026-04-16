'use client';

import Link from 'next/link';
import { SAMPLE_ENGINE_SIGNALS } from '@/lib/sample-data';

const ENGINE_COLORS = {
  choice: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  affordability: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  lifecycle: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  profitability: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

const ENGINE_LABELS = {
  choice: 'Choice Engine',
  affordability: 'Affordability',
  lifecycle: 'Lifecycle',
  profitability: 'Profitability',
};

export function EngineSignals() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Engine Signals</h3>
        <span className="bg-dh-red text-white text-xs font-medium px-2 py-1 rounded-full">
          {SAMPLE_ENGINE_SIGNALS.length} active
        </span>
      </div>

      <div className="space-y-3">
        {SAMPLE_ENGINE_SIGNALS.map((signal, index) => {
          const colors = ENGINE_COLORS[signal.engine];
          return (
            <div key={index} className={`rounded-lg p-3 ${colors.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
                <span className={`text-xs font-medium ${colors.text}`}>
                  {ENGINE_LABELS[signal.engine]}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{signal.message}</p>
              <Link
                href={`/${signal.ctaTab}`}
                className="text-xs font-medium text-dh-red hover:underline"
              >
                {signal.ctaLabel}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}