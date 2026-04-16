'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/lib/NotificationContext';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  variant: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const { addNotification } = useNotifications();

  const actions: QuickAction[] = [
    {
      id: 'add-sku',
      label: 'Add New SKU',
      icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
      shortcut: '⌘N',
      variant: 'primary',
      action: () => {
        addNotification({
          type: 'info',
          title: 'Add SKU',
          message: 'SKU creation form opened',
        });
      },
    },
    {
      id: 'run-engines',
      label: 'Run All Engines',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      shortcut: '⌘E',
      variant: 'secondary',
      action: () => {
        addNotification({
          type: 'success',
          title: 'Engines Running',
          message: 'All recommendation engines are processing',
        });
      },
    },
    {
      id: 'export-report',
      label: 'Export Report',
      icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
      shortcut: '⌘D',
      variant: 'secondary',
      action: () => {
        addNotification({
          type: 'success',
          title: 'Export Started',
          message: 'Report is being generated and will download shortly',
        });
      },
    },
    {
      id: 'bulk-update',
      label: 'Bulk Update Prices',
      icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
      variant: 'secondary',
      action: () => {
        addNotification({
          type: 'info',
          title: 'Bulk Update',
          message: 'Select SKUs from the table to update prices',
        });
      },
    },
    {
      id: 'clear-alerts',
      label: 'Clear All Alerts',
      icon: 'M5 13l4 4L19 7',
      variant: 'secondary',
      action: () => {
        addNotification({
          type: 'success',
          title: 'Alerts Cleared',
          message: 'All non-critical alerts have been dismissed',
        });
      },
    },
  ];

  return (
    <div className="relative">
      {/* Quick Actions Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Quick Actions
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="p-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => {
                  action.action();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition text-left"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  action.variant === 'primary' ? 'bg-dh-red/10 text-dh-red' :
                  action.variant === 'danger' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{action.label}</p>
                  {action.shortcut && (
                    <p className="text-xs text-gray-400">{action.shortcut}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}