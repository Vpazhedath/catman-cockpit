'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/lib/NotificationContext';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataTitle: string;
}

type ExportFormat = 'csv' | 'xlsx' | 'json';
type ExportScope = 'current' | 'all' | 'filtered';

export function ExportModal({ isOpen, onClose, dataTitle }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('xlsx');
  const [scope, setScope] = useState<ExportScope>('current');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);

    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));

    addNotification({
      type: 'success',
      title: 'Export Complete',
      message: `${dataTitle} exported as ${format.toUpperCase()}`,
    });

    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dh-blue">Export Data</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{dataTitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['xlsx', 'csv', 'json'] as ExportFormat[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition ${
                    format === f
                      ? 'border-dh-red bg-red-50 text-dh-red'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Data Scope</label>
            <div className="space-y-2">
              {[
                { value: 'current', label: 'Current View', desc: 'Export only visible data' },
                { value: 'filtered', label: 'Filtered Results', desc: 'Export all matching filters' },
                { value: 'all', label: 'All Data', desc: 'Export complete dataset' },
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                    scope === option.value ? 'border-dh-red bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="scope"
                    value={option.value}
                    checked={scope === option.value}
                    onChange={() => setScope(option.value as ExportScope)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${scope === option.value ? 'border-dh-red bg-dh-red' : 'border-gray-300'}`}>
                    {scope === option.value && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHeaders}
                onChange={e => setIncludeHeaders(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-dh-red focus:ring-dh-red"
              />
              <span className="text-sm text-gray-700">Include column headers</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}