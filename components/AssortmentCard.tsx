'use client';

interface AssortmentCardProps {
  source: 'competitor' | 'search' | 'nielsen';
  skuName: string;
  rationale: string;
  confidence: number;
  onAdd: () => void;
  isAccepted?: boolean;
}

const SOURCE_STYLES = {
  competitor: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Competitor signal' },
  search: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Search trend' },
  nielsen: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Nielsen data' },
};

export function AssortmentCard({ source, skuName, rationale, confidence, onAdd, isAccepted }: AssortmentCardProps) {
  const sourceStyle = SOURCE_STYLES[source];

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm transition-all ${isAccepted ? 'ring-2 ring-green-500 bg-green-50/30' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${sourceStyle.bg} ${sourceStyle.text}`}>
          {sourceStyle.label}
        </span>
        {isAccepted && (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added
          </span>
        )}
      </div>

      <h4 className="text-lg font-semibold text-dh-blue mb-2">{skuName}</h4>

      <p className="text-sm text-gray-600 mb-4">{rationale}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Confidence</span>
          <span className="font-medium text-dh-blue">{confidence}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isAccepted ? 'bg-green-500' : 'bg-dh-green'}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={isAccepted}
        className={`w-full py-2 px-4 text-sm font-medium rounded-lg transition ${
          isAccepted
            ? 'bg-green-100 text-green-700 cursor-default'
            : 'bg-dh-red text-white hover:bg-red-700'
        }`}
      >
        {isAccepted ? 'Added to Pipeline' : 'Add to assortment'}
      </button>
    </div>
  );
}