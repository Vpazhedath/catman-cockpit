'use client';

import { Button } from '@/components/ui/Button';

interface AssortmentCardProps {
  source: 'competitor' | 'search' | 'nielsen';
  skuName: string;
  rationale: string;
  confidence: number;
  onAdd: () => void;
  isAccepted?: boolean;
}

const SOURCE_STYLES = {
  competitor: { bg: 'bg-cp-color-surface-information-subtle', text: 'text-cp-color-text-information', label: 'Competitor signal' },
  search: { bg: 'bg-cp-color-surface-brand-subtle', text: 'text-cp-color-text-brand', label: 'Search trend' },
  nielsen: { bg: 'bg-cp-color-surface-warning-subtle', text: 'text-cp-color-text-warning', label: 'Nielsen data' },
};

export function AssortmentCard({ source, skuName, rationale, confidence, onAdd, isAccepted }: AssortmentCardProps) {
  const sourceStyle = SOURCE_STYLES[source];

  return (
    <div className={`bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-5 transition-all ${isAccepted ? 'ring-2 ring-cp-color-surface-success bg-cp-color-surface-success-subtle/30' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${sourceStyle.bg} ${sourceStyle.text}`}>
          {sourceStyle.label}
        </span>
        {isAccepted && (
          <span className="inline-flex items-center gap-1 text-xs text-cp-color-text-success font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added
          </span>
        )}
      </div>

      <h4 className="text-lg font-semibold text-cp-color-text-primary mb-2">{skuName}</h4>

      <p className="text-sm text-cp-color-text-secondary mb-4">{rationale}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-cp-color-text-tertiary">Confidence</span>
          <span className="font-medium text-cp-color-text-primary">{confidence}%</span>
        </div>
        <div className="h-2 bg-cp-color-surface-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isAccepted ? 'bg-cp-color-surface-success' : 'bg-cp-color-surface-brand'}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <Button
        onClick={onAdd}
        disabled={isAccepted}
        variant={isAccepted ? 'outline' : 'primary'}
        className="w-full"
      >
        {isAccepted ? 'Added to Pipeline' : 'Add to assortment'}
      </Button>
    </div>
  );
}