'use client';

import { useState } from 'react';
import { FilterChips } from '@/components/FilterChips';
import { SKUTable } from '@/components/SKUTable';
import { SAMPLE_SKUS } from '@/lib/sample-data';

export default function SKUTowerPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const counts = {
    all: SAMPLE_SKUS.length,
    live: SAMPLE_SKUS.filter(s => s.status === 'live').length,
    new: SAMPLE_SKUS.filter(s => s.status === 'new').length,
    oos: SAMPLE_SKUS.filter(s => s.status === 'oos').length,
    'phase-out': SAMPLE_SKUS.filter(s => s.status === 'phase-out').length,
  };

  const filteredData = activeFilter === 'all'
    ? SAMPLE_SKUS
    : SAMPLE_SKUS.filter(s => s.status === activeFilter);

  return (
    <div className="space-y-4">
      <FilterChips
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        counts={counts}
      />
      <SKUTable data={filteredData} />
    </div>
  );
}