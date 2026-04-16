'use client';

import { useState } from 'react';
import { IconArc } from './icons/IconArc';
import { DH_ENTITIES } from '@/lib/sample-data';
import { SearchInput } from './ui/SearchInput';
import { DateRangePicker } from './ui/DatePicker';
import { NotificationPanel } from './NotificationPanel';

export function Header() {
  const [selectedEntity, setSelectedEntity] = useState('Talabat UAE');
  const [isEntityOpen, setIsEntityOpen] = useState(false);

  return (
    <header className="bg-dh-blue text-white px-6 py-3 flex items-center justify-between gap-6">
      {/* Logo & Brand */}
      <div className="flex items-center gap-4 shrink-0">
        <IconArc size={40} />
        <span className="text-lg font-semibold hidden sm:inline">CatMan Cockpit</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <SearchInput placeholder="Search SKUs, categories..." />
      </div>

      {/* Entity Selector */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsEntityOpen(!isEntityOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/15 transition"
        >
          <span className="hidden md:inline">{selectedEntity}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isEntityOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white text-dh-blue rounded-lg shadow-lg py-1 min-w-48 z-50">
            {DH_ENTITIES.map((entity) => (
              <button
                key={entity}
                onClick={() => {
                  setSelectedEntity(entity);
                  setIsEntityOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-dh-gray transition ${
                  selectedEntity === entity ? 'font-medium text-dh-red' : ''
                }`}
              >
                {entity}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <DateRangePicker />

        {/* Notifications */}
        <NotificationPanel />

        {/* User Avatar */}
        <button className="w-8 h-8 bg-dh-red rounded-full flex items-center justify-center text-sm font-medium">
          VP
        </button>
      </div>
    </header>
  );
}