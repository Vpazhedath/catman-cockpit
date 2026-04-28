'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <header className="bg-dh-blue text-white px-6 py-3 flex items-center justify-end gap-6">

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
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/15 transition"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <DateRangePicker />

        {/* Notifications */}
        <NotificationPanel />

        {/* User Avatar */}
        <UserDropdown />
      </div>
    </header>
  );
}