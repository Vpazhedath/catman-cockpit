'use client';

interface AssortmentCardProps {
  source: 'competitor' | 'search' | 'nielsen';
  skuName: string;
  rationale: string;
  confidence: number;
  onAdd: () => void;
}

const SOURCE_STYLES = {
  competitor: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Competitor signal' },
  search: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Search trend' },
  nielsen: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Nielsen data' },
};

export function AssortmentCard({ source, skuName, rationale, confidence, onAdd }: AssortmentCardProps) {
  const sourceStyle = SOURCE_STYLES[source];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${sourceStyle.bg} ${sourceStyle.text} mb-3`}>
        {sourceStyle.label}
      </span>

      <h4 className="text-lg font-semibold text-dh-blue mb-2">{skuName}</h4>

      <p className="text-sm text-gray-600 mb-4">{rationale}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Confidence</span>
          <span className="font-medium text-dh-blue">{confidence}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-dh-green rounded-full transition-all duration-300"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <button
        onClick={onAdd}
        className="w-full py-2 px-4 bg-dh-red text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
      >
        Add to assortment
      </button>
    </div>
  );
}