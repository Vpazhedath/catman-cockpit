'use client';

import { useState } from 'react';
import { IconArc } from './icons/IconArc';
import { DH_ENTITIES } from '@/lib/sample-data';

export function Header() {
  const [selectedEntity, setSelectedEntity] = useState('Talabat UAE');
  const [isEntityOpen, setIsEntityOpen] = useState(false);

  return (
    <header className="bg-dh-blue text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <IconArc size={40} />
        <span className="text-lg font-semibold">CatMan Cockpit</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsEntityOpen(!isEntityOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/15 transition"
        >
          <span>{selectedEntity}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isEntityOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white text-dh-blue rounded-lg shadow-lg py-1 min-w-48 z-50">
            {DH_ENTITIES.map((entity) => (
              <button
                key={entity}
                onClick={() => {
                  setSelectedEntity(entity);
                  setIsEntityOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-dh-gray transition"
              >
                {entity}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-dh-red rounded-full"></span>
        </button>
      </div>
    </header>
  );
}