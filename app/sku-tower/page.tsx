'use client';

import { useState, useMemo } from 'react';
import { FilterChips } from '@/components/FilterChips';
import { SKUTable } from '@/components/SKUTable';
import { SAMPLE_SKUS, RELEVANT_SKUS, SKUWithWarehouses } from '@/lib/sample-data';
import { SKUDetailModal } from '@/components/modals/SKUDetailModal';
import { Button } from '@/components/ui/Button';

export default function SKUTowerPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'margin' | 'price' | 'warehouses'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedSKU, setSelectedSKU] = useState<SKUWithWarehouses | null>(null);
  const [showRelevantOnly, setShowRelevantOnly] = useState(true);

  // Data source based on filter toggle
  const baseData = showRelevantOnly ? RELEVANT_SKUS : SAMPLE_SKUS;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(baseData.map(s => s.category));
    return ['all', ...Array.from(cats)];
  }, [baseData]);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...baseData];

    // Status filter
    if (activeFilter !== 'all') {
      data = data.filter(s => s.status === activeFilter);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      data = data.filter(s => s.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.supplier.toLowerCase().includes(query)
      );
    }

    // Sort
    data.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'margin') {
        comparison = a.margin - b.margin;
      } else if (sortBy === 'price') {
        comparison = a.basePrice - b.basePrice;
      } else if (sortBy === 'warehouses') {
        comparison = a.warehouses.filter(w => w.inStock).length - b.warehouses.filter(w => w.inStock).length;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return data;
  }, [activeFilter, selectedCategory, searchQuery, sortBy, sortOrder, baseData]);

  // Calculate counts based on DMart Lifecycle Strategy statuses
  const counts = {
    all: baseData.length,
    active: baseData.filter(s => s.status === 'active').length,
    'on-hold': baseData.filter(s => s.status === 'on-hold').length,
    discontinued: baseData.filter(s => s.status === 'discontinued').length,
    retired: baseData.filter(s => s.status === 'retired').length,
  };

  // Summary stats
  const avgMargin = useMemo(() => {
    const total = filteredData.reduce((sum, s) => sum + s.margin, 0);
    return filteredData.length > 0 ? (total / filteredData.length).toFixed(1) : '0';
  }, [filteredData]);

  const totalWarehouseCoverage = useMemo(() => {
    const totalWarehouses = filteredData.reduce((sum, s) => sum + s.warehouses.filter(w => w.inStock).length, 0);
    const maxWarehouses = filteredData.length * 5; // 5 warehouses per SKU
    return maxWarehouses > 0 ? ((totalWarehouses / maxWarehouses) * 100).toFixed(0) : '0';
  }, [filteredData]);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-4">
          <p className="text-xs text-cp-color-text-secondary">Total SKUs</p>
          <p className="text-xl font-bold text-cp-color-text-primary">{filteredData.length}</p>
        </div>
        <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-4">
          <p className="text-xs text-cp-color-text-secondary">Avg Margin</p>
          <p className="text-xl font-bold text-cp-color-text-success">{avgMargin}%</p>
        </div>
        <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-4">
          <p className="text-xs text-cp-color-text-secondary">Categories</p>
          <p className="text-xl font-bold text-cp-color-text-primary">{categories.length - 1}</p>
        </div>
        <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-4">
          <p className="text-xs text-cp-color-text-secondary">Warehouse Coverage</p>
          <p className="text-xl font-bold text-cp-color-text-brand">{totalWarehouseCoverage}%</p>
        </div>
        <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-4">
          <p className="text-xs text-cp-color-text-secondary">Actions Needed</p>
          <p className="text-xl font-bold text-cp-color-text-warning">
            {filteredData.filter(s => s.engineSignals.length > 0).length}
          </p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Relevance Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showRelevantOnly}
            onChange={(e) => setShowRelevantOnly(e.target.checked)}
            className="w-4 h-4 rounded border-cp-color-border-primary text-cp-color-surface-brand focus:ring-cp-color-surface-brand"
          />
          <span className="text-sm text-cp-color-text-secondary">
            Show relevant SKUs only ({RELEVANT_SKUS.length} of {SAMPLE_SKUS.length})
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <FilterChips
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={counts}
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-cp-color-surface-primary border border-cp-color-border-primary rounded-lg text-sm text-cp-color-text-secondary focus:outline-none focus:ring-2 focus:ring-cp-color-surface-brand"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cp-color-text-tertiary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKUs, suppliers..."
            className="w-full pl-10 pr-4 py-2 bg-cp-color-surface-primary border border-cp-color-border-primary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cp-color-surface-brand"
          />
        </div>

        {/* Sort */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field as 'name' | 'margin' | 'price' | 'warehouses');
            setSortOrder(order as 'asc' | 'desc');
          }}
          className="px-3 py-2 bg-cp-color-surface-primary border border-cp-color-border-primary rounded-lg text-sm text-cp-color-text-secondary focus:outline-none focus:ring-2 focus:ring-cp-color-surface-brand"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="margin-desc">Margin (High to Low)</option>
          <option value="margin-asc">Margin (Low to High)</option>
          <option value="warehouses-desc">Most Warehouses</option>
          <option value="warehouses-asc">Fewest Warehouses</option>
        </select>

        {/* Export */}
        <Button variant="outline" size="sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </Button>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-cp-color-text-secondary">
          Found {filteredData.length} SKU{filteredData.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </p>
      )}

      {/* Table */}
      <SKUTable data={filteredData} onRowDoubleClick={setSelectedSKU} />

      {/* Detail Modal */}
      <SKUDetailModal sku={selectedSKU} onClose={() => setSelectedSKU(null)} />
    </div>
  );
}