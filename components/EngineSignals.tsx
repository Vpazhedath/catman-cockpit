'use client';

import Link from 'next/link';
import { SAMPLE_ENGINE_SIGNALS } from '@/lib/sample-data';

const ENGINE_COLORS = {
  choice: { bg: 'bg-cp-color-surface-information-subtle', text: 'text-cp-color-text-information', dot: 'bg-cp-color-surface-information' },
  affordability: { bg: 'bg-cp-color-surface-warning-subtle', text: 'text-cp-color-text-warning', dot: 'bg-cp-color-surface-warning' },
  lifecycle: { bg: 'bg-cp-color-surface-brand-subtle', text: 'text-cp-color-text-brand', dot: 'bg-cp-color-surface-brand' },
  profitability: { bg: 'bg-cp-color-surface-success-subtle', text: 'text-cp-color-text-success', dot: 'bg-cp-color-surface-success' },
};

const ENGINE_LABELS = {
  choice: 'Choice Engine',
  affordability: 'Affordability',
  lifecycle: 'Lifecycle',
  profitability: 'Profitability',
};

export function EngineSignals() {
  return (
    <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-cp-color-text-secondary">Engine Signals</h3>
        <span className="bg-cp-color-surface-brand text-cp-color-text-inverse text-xs font-medium px-2 py-1 rounded-full">
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
              <p className="text-sm text-cp-color-text-primary mb-2">{signal.message}</p>
              <Link
                href={`/${signal.ctaTab}`}
                className="text-xs font-medium text-cp-color-text-brand hover:underline"
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