'use client';

import { SKUWithWarehouses } from '@/lib/sample-data';

interface SKUTableProps {
  data: SKUWithWarehouses[];
  onRowDoubleClick?: (sku: SKUWithWarehouses) => void;
}

// Status styles based on DMart Lifecycle Strategy
const STATUS_STYLES = {
  active: { bg: 'bg-cp-color-surface-success-subtle', text: 'text-cp-color-text-success', label: 'Active' },
  'on-hold': { bg: 'bg-cp-color-surface-warning-subtle', text: 'text-cp-color-text-warning', label: 'On-Hold' },
  discontinued: { bg: 'bg-cp-color-surface-error-subtle', text: 'text-cp-color-text-error', label: 'Discontinued' },
  retired: { bg: 'bg-cp-color-surface-secondary', text: 'text-cp-color-text-secondary', label: 'Retired' },
};

const MATURITY_STYLES = {
  new: { bg: 'bg-cp-color-surface-information-subtle', text: 'text-cp-color-text-information', label: 'New' },
  probation: { bg: 'bg-cp-color-surface-brand-subtle', text: 'text-cp-color-text-brand', label: 'Probation' },
  mature: { bg: 'bg-cp-color-surface-success-subtle', text: 'text-cp-color-text-success', label: 'Mature' },
  review: { bg: 'bg-cp-color-surface-warning-subtle', text: 'text-cp-color-text-warning', label: 'Review' },
  'phase-out': { bg: 'bg-cp-color-surface-error-subtle', text: 'text-cp-color-text-error', label: 'Phase-out' },
};

const ENGINE_COLORS: Record<string, string> = {
  choice: 'bg-cp-color-surface-information',
  affordability: 'bg-cp-color-surface-warning',
  lifecycle: 'bg-cp-color-surface-brand',
  profitability: 'bg-cp-color-surface-success',
};

export function SKUTable({ data, onRowDoubleClick }: SKUTableProps) {
  return (
    <div className="space-y-2">
      {/* Hint banner */}
      <div className="flex items-center gap-2 px-3 py-2 bg-cp-color-surface-information-subtle border border-cp-color-surface-information rounded-lg">
        <svg className="w-4 h-4 text-cp-color-text-information shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs text-cp-color-text-information">
          Double-click on a row to view detailed SKU information including warehouse distribution
        </span>
      </div>

      <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl overflow-hidden">
        <table className="w-full">
        <thead className="bg-cp-color-surface-secondary border-b border-cp-color-border-primary">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">SKU Name</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Category</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Status</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Stage</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Warehouses</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Cost (AED)</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Base Price</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Margin</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-cp-color-text-secondary uppercase">Signals</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cp-color-border-primary">
          {data.map((row) => {
            const statusStyle = STATUS_STYLES[row.status];
            const maturityStyle = MATURITY_STYLES[row.maturityStage];
            const marginColor = row.margin >= 30 ? 'text-cp-color-text-success' : row.margin >= 20 ? 'text-cp-color-text-warning' : 'text-cp-color-text-error';
            const activeWarehouses = row.warehouses.filter(w => w.inStock).length;
            const totalWarehouses = row.warehouses.length;

            return (
              <tr
                key={row.skuId}
                className="hover:bg-cp-color-surface-secondary cursor-pointer transition-colors group"
                onDoubleClick={() => onRowDoubleClick?.(row)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-medium text-cp-color-text-primary">{row.name}</p>
                      <p className="text-xs text-cp-color-text-tertiary">{row.supplier}</p>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 text-xs text-cp-color-text-brand transition-opacity">
                      View details →
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-cp-color-text-secondary">{row.category}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                    {statusStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${maturityStyle.bg} ${maturityStyle.text}`}>
                    {maturityStyle.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    {row.warehouses.map((wh) => (
                      <div
                        key={wh.warehouse}
                        className={`w-3 h-3 rounded-sm ${wh.inStock ? 'bg-cp-color-surface-success' : 'bg-cp-color-surface-secondary'}`}
                        title={`${wh.warehouse}: ${wh.inStock ? `${wh.quantity} units` : 'Out of stock'} (${wh.lastUpdated})`}
                      />
                    ))}
                    <span className="text-xs text-cp-color-text-tertiary ml-1">{activeWarehouses}/{totalWarehouses}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-cp-color-text-secondary text-right">{row.costPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-cp-color-text-secondary text-right">{row.basePrice.toFixed(2)}</td>
                <td className={`px-4 py-3 text-sm font-medium text-right ${marginColor}`}>
                  {row.margin}%
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    {row.engineSignals.map((signal, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${ENGINE_COLORS[signal] || 'bg-cp-color-surface-secondary'}`}
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
    </div>
  );
}