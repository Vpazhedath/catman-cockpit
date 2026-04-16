'use client';

import { SKULifecycleState } from '@/lib/lifecycle-engine';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SKUDetailModalProps {
  sku: SKULifecycleState | null;
  onClose: () => void;
}

export function SKUDetailModal({ sku, onClose }: SKUDetailModalProps) {
  if (!sku) return null;

  const maturityColors = {
    new: 'bg-blue-500',
    probation: 'bg-purple-500',
    mature: 'bg-green-500',
    review: 'bg-amber-500',
    'phase-out': 'bg-red-500',
  };

  const efficiencyColors = {
    efficient: 'text-green-600 bg-green-50',
    'slow-mover': 'text-amber-600 bg-amber-50',
    'zero-mover': 'text-red-600 bg-red-50',
    'low-availability': 'text-orange-600 bg-orange-50',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-dh-blue">{sku.name}</h2>
              <p className="text-gray-500 mt-1">{sku.category} • {sku.supplier}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Lifecycle Stage */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Lifecycle Stage</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${maturityColors[sku.maturityStage]} flex items-center justify-center text-white font-bold`}>
                  {sku.daysInAssortment}
                </div>
                <div>
                  <p className="font-medium text-dh-blue capitalize">{sku.maturityStage}</p>
                  <p className="text-xs text-gray-500">Days in assortment</p>
                </div>
              </div>
              <div className={`px-3 py-2 rounded-lg ${efficiencyColors[sku.efficiency]}`}>
                <p className="text-sm font-medium capitalize">{sku.efficiency.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-dh-blue">{sku.weeklyUnitsSold}</p>
                <p className="text-xs text-gray-500">Units/Week</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${sku.availability >= 90 ? 'text-green-600' : 'text-amber-600'}`}>
                  {sku.availability}%
                </p>
                <p className="text-xs text-gray-500">Availability</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${sku.daysOnHand <= 14 ? 'text-green-600' : sku.daysOnHand <= 30 ? 'text-amber-600' : 'text-red-600'}`}>
                  {sku.daysOnHand}
                </p>
                <p className="text-xs text-gray-500">Days on Hand</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${sku.shrinkage <= 10 ? 'text-green-600' : 'text-red-600'}`}>
                  {sku.shrinkage}%
                </p>
                <p className="text-xs text-gray-500">Shrinkage</p>
              </div>
            </div>
          </div>

          {/* Status & Service Level */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Current Status</h3>
              <div className="flex items-center gap-2">
                <StatusBadge status={sku.status === 'active' ? 'live' : sku.status === 'on-hold' ? 'oos' : 'phase-out'} />
                <span className="text-sm text-gray-500 capitalize">{sku.status}</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Service Level</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${sku.serviceLevel >= 90 ? 'bg-green-500' : sku.serviceLevel >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${sku.serviceLevel}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{sku.serviceLevel}%</span>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          {sku.recommendedAction && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-amber-800">Recommended Action</h4>
                  <p className="text-sm text-amber-700 mt-1">{sku.recommendedAction.reason}</p>
                  <p className="text-xs text-amber-600 mt-2">Impact: {sku.recommendedAction.estimatedImpact}</p>
                </div>
              </div>
            </div>
          )}

          {/* Clearance Discount */}
          {sku.clearanceDiscount && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-green-800">Clearance Recommended</h4>
                  <p className="text-sm text-green-700">Optimal discount to maximize sales</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">{sku.clearanceDiscount}%</p>
                  <p className="text-xs text-green-600">discount</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <div className="flex gap-2">
            {sku.recommendedAction && (
              <>
                <Button variant="outline">Dismiss</Button>
                <Button>Take Action</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}