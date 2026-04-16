'use client';

import { useState, useMemo } from 'react';
import { FilterChips } from '@/components/FilterChips';
import { SKUTable } from '@/components/SKUTable';
import { SAMPLE_SKUS } from '@/lib/sample-data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function SKUTowerPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'margin' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(SAMPLE_SKUS.map(s => s.category));
    return ['all', ...Array.from(cats)];
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let data = [...SAMPLE_SKUS];

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
        s.category.toLowerCase().includes(query)
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
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return data;
  }, [activeFilter, selectedCategory, searchQuery, sortBy, sortOrder]);

  // Calculate counts
  const counts = {
    all: SAMPLE_SKUS.length,
    live: SAMPLE_SKUS.filter(s => s.status === 'live').length,
    new: SAMPLE_SKUS.filter(s => s.status === 'new').length,
    oos: SAMPLE_SKUS.filter(s => s.status === 'oos').length,
    'phase-out': SAMPLE_SKUS.filter(s => s.status === 'phase-out').length,
  };

  // Summary stats
  const avgMargin = useMemo(() => {
    const total = filteredData.reduce((sum, s) => sum + s.margin, 0);
    return filteredData.length > 0 ? (total / filteredData.length).toFixed(1) : '0';
  }, [filteredData]);

  const totalValue = useMemo(() => {
    return filteredData.reduce((sum, s) => sum + s.basePrice, 0).toFixed(2);
  }, [filteredData]);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding="sm">
          <p className="text-xs text-gray-500">Total SKUs</p>
          <p className="text-xl font-bold text-dh-blue">{filteredData.length}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Avg Margin</p>
          <p className="text-xl font-bold text-green-600">{avgMargin}%</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Categories</p>
          <p className="text-xl font-bold text-dh-blue">{categories.length - 1}</p>
        </Card>
        <Card padding="sm">
          <p className="text-xs text-gray-500">Actions Needed</p>
          <p className="text-xl font-bold text-amber-600">
            {filteredData.filter(s => s.engineSignals.length > 0).length}
          </p>
        </Card>
      </div>

      {/* Filters Row */}
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
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-dh-red"
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
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
            placeholder="Search SKUs..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dh-red"
          />
        </div>

        {/* Sort */}
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field as 'name' | 'margin' | 'price');
            setSortOrder(order as 'asc' | 'desc');
          }}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-dh-red"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="margin-desc">Margin (High to Low)</option>
          <option value="margin-asc">Margin (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="price-asc">Price (Low to High)</option>
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
        <p className="text-sm text-gray-500">
          Found {filteredData.length} SKU{filteredData.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </p>
      )}

      {/* Table */}
      <SKUTable data={filteredData} />
    </div>
  );
}