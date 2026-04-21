'use client';

interface FilterChipsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: { all: number; active: number; 'on-hold': number; discontinued: number; retired: number };
}

// Filter options based on DMart Lifecycle Strategy SKU statuses
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'on-hold', label: 'On-Hold' },
  { key: 'discontinued', label: 'Discontinued' },
  { key: 'retired', label: 'Retired' },
];

export function FilterChips({ activeFilter, onFilterChange, counts }: FilterChipsProps) {
  return (
    <div className="flex gap-2 mb-4">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? 'bg-cp-color-surface-brand text-cp-color-text-inverse'
                : 'bg-cp-color-surface-primary text-cp-color-text-secondary hover:bg-cp-color-surface-secondary border border-cp-color-border-primary'
            }`}
          >
            {filter.label} <span className="text-xs opacity-70">({counts[filter.key as keyof typeof counts] || 0})</span>
          </button>
        );
      })}
    </div>
  );
}