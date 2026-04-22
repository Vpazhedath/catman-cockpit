'use client';

import { useState } from 'react';
import { DH_ENTITIES } from '@/lib/sample-data';
import { DateRangePicker } from './ui/DatePicker';
import { NotificationPanel } from './NotificationPanel';
import { CommandPalette } from './CommandPalette';
import { UserDropdown } from './UserDropdown';
import { CategorySelector } from './CategorySelector';
import { useAppContext } from '@/lib/AppContext';

export function Header() {
  const { state, setEntity, setCategoryL0, setCategoryL1, setCategoryL2 } = useAppContext();
  const [isEntityOpen, setIsEntityOpen] = useState(false);

  return (
    <header className="bg-dh-blue text-white px-6 py-3 flex items-center justify-between gap-6">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <span className="text-sm font-bold text-dh-blue">DH</span>
        </div>
        <span className="text-lg font-semibold">CatMan Cockpit</span>
      </div>

      {/* Category Selector */}
      <CategorySelector
        selectedL0={state.categoryL0}
        selectedL1={state.categoryL1}
        selectedL2={state.categoryL2}
        onL0Select={setCategoryL0}
        onL1Select={setCategoryL1}
        onL2Select={setCategoryL2}
      />

      {/* Command Palette */}
      <CommandPalette />

      {/* Entity Selector */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsEntityOpen(!isEntityOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/15 transition"
        >
          <span className="hidden md:inline">{state.entity}</span>
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
                  setEntity(entity);
                  setIsEntityOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-dh-gray transition ${
                  state.entity === entity ? 'font-medium text-dh-red' : ''
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
        <UserDropdown />
      </div>
    </header>
  );
}