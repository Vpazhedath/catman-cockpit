'use client';

interface SKURow {
  name: string;
  category: string;
  status: 'active' | 'on-hold' | 'discontinued' | 'retired';
  maturityStage?: 'new' | 'probation' | 'mature' | 'review' | 'phase-out';
  efficiency?: 'efficient' | 'slow-mover' | 'zero-mover' | 'low-availability';
  costPrice: number;
  basePrice: number;
  discount: number | null;
  margin: number;
  engineSignals: readonly string[];
}

interface SKUTableProps {
  data: SKURow[];
}

// Status styles based on DMart Lifecycle Strategy
const STATUS_STYLES = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  'on-hold': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'On-Hold' },
  discontinued: { bg: 'bg-red-100', text: 'text-red-700', label: 'Discontinued' },
  retired: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Retired' },
};

const MATURITY_STYLES = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
  probation: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Probation' },
  mature: { bg: 'bg-green-100', text: 'text-green-700', label: 'Mature' },
  review: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Review' },
  'phase-out': { bg: 'bg-red-100', text: 'text-red-700', label: 'Phase-out' },
};

const ENGINE_COLORS: Record<string, string> = {
  choice: 'bg-blue-500',
  affordability: 'bg-amber-500',
  lifecycle: 'bg-purple-500',
  profitability: 'bg-green-500',
};

export function SKUTable({ data }: SKUTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">SKU Name</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Stage</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Cost (AED)</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Base Price</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Discount</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Margin</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Signals</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) => {
            const statusStyle = STATUS_STYLES[row.status];
            const maturityStyle = row.maturityStage ? MATURITY_STYLES[row.maturityStage] : null;
            const marginColor = row.margin >= 30 ? 'text-green-600' : row.margin >= 20 ? 'text-amber-600' : 'text-red-600';

            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-dh-blue">{row.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{row.category}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {maturityStyle && (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${maturityStyle.bg} ${maturityStyle.text}`}>
                      {maturityStyle.label}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{row.costPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{row.basePrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {row.discount ? `${row.discount}%` : '-'}
                </td>
                <td className={`px-4 py-3 text-sm font-medium text-right ${marginColor}`}>
                  {row.margin}%
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    {row.engineSignals.map((signal, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${ENGINE_COLORS[signal] || 'bg-gray-300'}`}
                        title={signal}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}