'use client';

interface FilterChipsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'new', label: 'New' },
  { key: 'oos', label: 'OOS' },
  { key: 'phase-out', label: 'Phase-out' },
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
                ? 'bg-dh-blue text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {filter.label} <span className="text-xs opacity-70">({counts[filter.key] || 0})</span>
          </button>
        );
      })}
    </div>
  );
}