'use client';

import { useState } from 'react';

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: '🏠' },
  { id: 'beverages', name: 'Beverages & Dairy', icon: '🥛' },
  { id: 'snacks', name: 'Snacks & Confectionery', icon: '🍫' },
  { id: 'fresh', name: 'Fresh & Frozen', icon: '🥬' },
  { id: 'grocery', name: 'Grocery & Staples', icon: '🛒' },
  { id: 'personal', name: 'Personal Care', icon: '🧴' },
  { id: 'household', name: 'Household', icon: '🧹' },
];

interface CategorySelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCategory = CATEGORIES.find(c => c.id === selected) || CATEGORIES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
      >
        <span>{selectedCategory.icon}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCategory.name}</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-56 z-50">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onSelect(category.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-dh-gray transition ${
                  selected === category.id ? 'bg-dh-gray font-medium text-dh-red' : 'text-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}