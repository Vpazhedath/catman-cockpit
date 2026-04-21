'use client';

import { SKUWithWarehouses } from '@/lib/sample-data';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SKUDetailModalProps {
  sku: SKUWithWarehouses | null;
  onClose: () => void;
}

const STATUS_STYLES = {
  active: { bg: 'bg-cp-color-surface-success-subtle', text: 'text-cp-color-text-success', label: 'Active' },
  'on-hold': { bg: 'bg-cp-color-surface-warning-subtle', text: 'text-cp-color-text-warning', label: 'On-Hold' },
  discontinued: { bg: 'bg-cp-color-surface-error-subtle', text: 'text-cp-color-text-error', label: 'Discontinued' },
  retired: { bg: 'bg-cp-color-surface-secondary', text: 'text-cp-color-text-secondary', label: 'Retired' },
};

const MATURITY_STYLES = {
  new: { bg: 'bg-cp-color-surface-information-subtle', text: 'text-cp-color-text-information' },
  probation: { bg: 'bg-cp-color-surface-brand-subtle', text: 'text-cp-color-text-brand' },
  mature: { bg: 'bg-cp-color-surface-success-subtle', text: 'text-cp-color-text-success' },
  review: { bg: 'bg-cp-color-surface-warning-subtle', text: 'text-cp-color-text-warning' },
  'phase-out': { bg: 'bg-cp-color-surface-error-subtle', text: 'text-cp-color-text-error' },
};

const EFFICIENCY_STYLES = {
  efficient: 'text-cp-color-text-success bg-cp-color-surface-success-subtle',
  'slow-mover': 'text-cp-color-text-warning bg-cp-color-surface-warning-subtle',
  'zero-mover': 'text-cp-color-text-error bg-cp-color-surface-error-subtle',
  'low-availability': 'text-cp-color-text-warning bg-cp-color-surface-warning-subtle',
};

export function SKUDetailModal({ sku, onClose }: SKUDetailModalProps) {
  if (!sku) return null;

  const statusStyle = STATUS_STYLES[sku.status];
  const maturityStyle = MATURITY_STYLES[sku.maturityStage];
  const activeWarehouses = sku.warehouses.filter(w => w.inStock);
  const totalStock = sku.warehouses.reduce((sum, w) => sum + w.quantity, 0);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="bg-cp-color-surface-primary rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-cp-color-border-primary shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-cp-color-border-primary">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-cp-color-text-tertiary font-mono">{sku.skuId}</span>
              </div>
              <h2 className="text-xl font-bold text-cp-color-text-primary">{sku.name}</h2>
              <p className="text-cp-color-text-secondary mt-1">{sku.category} • {sku.supplier}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-cp-color-surface-secondary rounded-lg transition"
            >
              <svg className="w-5 h-5 text-cp-color-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Efficiency Row */}
          <div className="flex items-center gap-4">
            <span className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
              {statusStyle.label}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${MATURITY_STYLES[sku.maturityStage].bg} ${MATURITY_STYLES[sku.maturityStage].text}`}>
              {sku.maturityStage}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${EFFICIENCY_STYLES[sku.efficiency]}`}>
              {sku.efficiency.replace('-', ' ')}
            </span>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-sm font-medium text-cp-color-text-secondary mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-cp-color-surface-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cp-color-text-primary">{sku.weeklyUnitsSold.toLocaleString()}</p>
                <p className="text-xs text-cp-color-text-tertiary">Units/Week</p>
              </div>
              <div className="bg-cp-color-surface-secondary rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${sku.availability >= 90 ? 'text-cp-color-text-success' : sku.availability >= 70 ? 'text-cp-color-text-warning' : 'text-cp-color-text-error'}`}>
                  {sku.availability}%
                </p>
                <p className="text-xs text-cp-color-text-tertiary">Availability</p>
              </div>
              <div className="bg-cp-color-surface-secondary rounded-lg p-4 text-center">
                <p className={`text-2xl font-bold ${sku.margin >= 30 ? 'text-cp-color-text-success' : 'text-cp-color-text-warning'}`}>
                  {sku.margin}%
                </p>
                <p className="text-xs text-cp-color-text-tertiary">Margin</p>
              </div>
              <div className="bg-cp-color-surface-secondary rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cp-color-text-primary">{activeWarehouses.length}/{sku.warehouses.length}</p>
                <p className="text-xs text-cp-color-text-tertiary">Warehouses</p>
              </div>
            </div>
          </div>

          {/* Warehouse Distribution */}
          <div>
            <h3 className="text-sm font-medium text-cp-color-text-secondary mb-3">Warehouse Distribution</h3>
            <div className="space-y-2">
              {sku.warehouses.map((wh) => (
                <div
                  key={wh.warehouse}
                  className={`flex items-center justify-between p-3 rounded-lg border ${wh.inStock ? 'border-cp-color-border-primary bg-cp-color-surface-primary' : 'border-cp-color-border-primary bg-cp-color-surface-secondary'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${wh.inStock ? 'bg-cp-color-surface-success' : 'bg-cp-color-surface-error'}`} />
                    <div>
                      <p className="text-sm font-medium text-cp-color-text-primary">{wh.warehouse}</p>
                      <p className="text-xs text-cp-color-text-tertiary">Updated {wh.lastUpdated}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {wh.inStock ? (
                      <div>
                        <p className="text-lg font-bold text-cp-color-text-primary">{wh.quantity.toLocaleString()}</p>
                        <p className="text-xs text-cp-color-text-tertiary">units in stock</p>
                      </div>
                    ) : (
                      <Badge variant="danger">Out of Stock</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Stock Summary */}
            <div className="mt-4 p-4 bg-cp-color-surface-brand-subtle rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-cp-color-text-brand">Total Stock Across All Warehouses</p>
                  <p className="text-xs text-cp-color-text-tertiary">{activeWarehouses.length} of {sku.warehouses.length} warehouses have stock</p>
                </div>
                <p className="text-3xl font-bold text-cp-color-text-primary">{totalStock.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-sm font-medium text-cp-color-text-secondary mb-3">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-cp-color-surface-secondary rounded-lg p-4">
                <p className="text-xs text-cp-color-text-tertiary mb-1">Cost Price</p>
                <p className="text-xl font-bold text-cp-color-text-primary">AED {sku.costPrice.toFixed(2)}</p>
              </div>
              <div className="bg-cp-color-surface-secondary rounded-lg p-4">
                <p className="text-xs text-cp-color-text-tertiary mb-1">Base Price</p>
                <p className="text-xl font-bold text-cp-color-text-primary">AED {sku.basePrice.toFixed(2)}</p>
              </div>
              <div className="bg-cp-color-surface-secondary rounded-lg p-4">
                <p className="text-xs text-cp-color-text-tertiary mb-1">Discount</p>
                <p className="text-xl font-bold text-cp-color-text-primary">{sku.discount ? `${sku.discount}%` : '-'}</p>
              </div>
            </div>
          </div>

          {/* Engine Signals */}
          {sku.engineSignals.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-cp-color-text-secondary mb-3">Engine Signals</h3>
              <div className="flex flex-wrap gap-2">
                {sku.engineSignals.map((signal, i) => (
                  <Badge key={i} variant="info">{signal}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-cp-color-border-primary flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="outline">View History</Button>
          <Button>Edit SKU</Button>
        </div>
      </div>
    </div>
  );
}