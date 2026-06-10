'use client';

import { useState, useMemo, useCallback } from 'react';
import { SAMPLE_SKUS, Warehouse, SKUStatus, WAREHOUSE_CLUSTERS, UAE_WAREHOUSES } from '@/lib/sample-data';
import { useTheme } from '@/lib/ThemeContext';
import { exportData, generateFilename, ExportColumn } from '@/lib/export';
import { ExportButton } from '@/components/ExportButton';
import { StatusDistributionChart } from '@/components/Charts';
import { SKUDrilldownPanel } from '@/components/SKUDrilldownPanel';

const CATEGORIES_L0 = [
  { id: 'all', name: 'All Categories' }, { id: 'beverages', name: 'Beverages' }, { id: 'dairy-chilled-eggs', name: 'Dairy & Eggs' },
  { id: 'snacks', name: 'Snacks & Confectionery' }, { id: 'personal-care-baby-health', name: 'Personal Care' },
  { id: 'home-pet', name: 'Home & Pet' }, { id: 'frozen', name: 'Frozen Foods' }, { id: 'packaged-foods', name: 'Packaged Foods' },
];

const statusStyle: Record<string, { bg: string; fg: string }> = { active: { bg: '#E5F5EC', fg: '#047538' }, 'on-hold': { bg: '#FFF8DF', fg: '#8F5D00' }, discontinued: { bg: '#FCEBE8', fg: '#BF280A' }, 'phase-out': { bg: '#FCEBE8', fg: '#BF280A' }, 'ready-for-po': { bg: '#DCFCE7', fg: '#15803D' }, retired: { bg: '#E9EAEC', fg: '#6C6D73' }, blocked: { bg: '#44403C', fg: '#FAFAF9' } };
const maturityStyle: Record<string, { bg: string; fg: string }> = { mature: { bg: '#E5F5EC', fg: '#047538' }, probation: { bg: '#EDEBFF', fg: '#3A22D5' }, review: { bg: '#FFF8DF', fg: '#8F5D00' }, 'phase-out': { bg: '#FCEBE8', fg: '#BF280A' }, new: { bg: '#EDEBFF', fg: '#4629FF' } };
const engineDots: Record<string, string> = { choice: '#4629FF', affordability: '#FFC400', lifecycle: '#6635B6', profitability: '#047538' };

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';

interface SKURow {
  skuId: string;
  name: string;
  category: string;
  status: SKUStatus;
  maturityStage: 'new' | 'probation' | 'mature' | 'review' | 'phase-out';
  efficiency: 'efficient' | 'slow-mover' | 'zero-mover' | 'low-availability';
  costPrice: number;
  basePrice: number;
  discount: number | null;
  margin: number;
  engineSignals: readonly string[];
  warehouses: Array<{ warehouse: Warehouse; status: SKUStatus; inStock: boolean; quantity: number; lastUpdated: string }>;
  supplier: string;
  weeklyUnitsSold: number;
  availability: number;
}

const STATUS_OPTIONS: { value: SKUStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'discontinued', label: 'Discontinued' },
  { value: 'retired', label: 'Retired' },
];

const MATURITY_OPTIONS = [
  { value: 'all', label: 'All Stages' },
  { value: 'new', label: 'New' },
  { value: 'probation', label: 'Probation' },
  { value: 'mature', label: 'Mature' },
  { value: 'review', label: 'Review' },
  { value: 'phase-out', label: 'Phase Out' },
];

const EFFICIENCY_OPTIONS = [
  { value: 'all', label: 'All Efficiency' },
  { value: 'efficient', label: 'Efficient' },
  { value: 'slow-mover', label: 'Slow Mover' },
  { value: 'zero-mover', label: 'Zero Mover' },
  { value: 'low-availability', label: 'Low Availability' },
];

const PRICE_RANGES = [
  { value: 'all', label: 'All Prices', min: 0, max: Infinity },
  { value: '0-5', label: 'AED 0 - 5', min: 0, max: 5 },
  { value: '5-10', label: 'AED 5 - 10', min: 5, max: 10 },
  { value: '10-20', label: 'AED 10 - 20', min: 10, max: 20 },
  { value: '20-50', label: 'AED 20 - 50', min: 20, max: 50 },
  { value: '50+', label: 'AED 50+', min: 50, max: Infinity },
];

const MARGIN_RANGES = [
  { value: 'all', label: 'All Margins', min: 0, max: 100 },
  { value: 'low', label: '< 20%', min: 0, max: 19 },
  { value: 'medium', label: '20% - 30%', min: 20, max: 30 },
  { value: 'high', label: '> 30%', min: 31, max: 100 },
];

const AVAILABILITY_RANGES = [
  { value: 'all', label: 'All Availability', min: 0, max: 100 },
  { value: 'critical', label: '< 70%', min: 0, max: 69 },
  { value: 'low', label: '70% - 85%', min: 70, max: 85 },
  { value: 'good', label: '85% - 95%', min: 85, max: 95 },
  { value: 'excellent', label: '> 95%', min: 95, max: 100 },
];

export default function SKUControlTowerPage() {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [skus, setSkus] = useState<SKURow[]>(SAMPLE_SKUS);
  const [loading, setLoading] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKURow | null>(null);
  const [viewMode, setViewMode] = useState<'sku' | 'matrix'>('sku');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [maturityFilter, setMaturityFilter] = useState('all');
  const [efficiencyFilter, setEfficiencyFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [marginFilter, setMarginFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [hoveredCell, setHoveredCell] = useState<{ skuId: string; warehouse: Warehouse } | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [matrixDisplayMode, setMatrixDisplayMode] = useState<'status' | 'price' | 'quantity'>('price');

  const card: React.CSSProperties = { background: t ? '#1E1E20' : '#fff', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 12 };
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';

  const counts = { all: skus.length, active: skus.filter(s => s.status === 'active').length, 'on-hold': skus.filter(s => s.status === 'on-hold').length, discontinued: skus.filter(s => s.status === 'discontinued').length };

  // Get unique suppliers for filter
  const suppliers = useMemo(() => {
    const uniqueSuppliers = [...new Set(skus.map(s => s.supplier))];
    return uniqueSuppliers.sort();
  }, [skus]);

  // Filtered SKUs for matrix view
  const filteredSkus = useMemo(() => {
    const priceRange = PRICE_RANGES.find(r => r.value === priceFilter) || PRICE_RANGES[0];
    const marginRange = MARGIN_RANGES.find(r => r.value === marginFilter) || MARGIN_RANGES[0];
    const availRange = AVAILABILITY_RANGES.find(r => r.value === availabilityFilter) || AVAILABILITY_RANGES[0];

    return skus.filter(sku => {
      const matchesStatus = statusFilter === 'all' || sku.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || sku.category === categoryFilter;
      const matchesSupplier = supplierFilter === 'all' || sku.supplier === supplierFilter;
      const matchesMaturity = maturityFilter === 'all' || sku.maturityStage === maturityFilter;
      const matchesEfficiency = efficiencyFilter === 'all' || sku.efficiency === efficiencyFilter;
      const matchesPrice = sku.basePrice >= priceRange.min && sku.basePrice < priceRange.max;
      const matchesMargin = sku.margin >= marginRange.min && sku.margin <= marginRange.max;
      const matchesAvailability = sku.availability >= availRange.min && sku.availability <= availRange.max;
      const matchesSearch = !search || sku.name.toLowerCase().includes(search.toLowerCase()) || sku.skuId.toLowerCase().includes(search.toLowerCase()) || sku.supplier.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesCategory && matchesSupplier && matchesMaturity && matchesEfficiency && matchesPrice && matchesMargin && matchesAvailability && matchesSearch;
    });
  }, [skus, statusFilter, categoryFilter, supplierFilter, maturityFilter, efficiencyFilter, priceFilter, marginFilter, availabilityFilter, search]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (categoryFilter !== 'all') count++;
    if (supplierFilter !== 'all') count++;
    if (maturityFilter !== 'all') count++;
    if (efficiencyFilter !== 'all') count++;
    if (priceFilter !== 'all') count++;
    if (marginFilter !== 'all') count++;
    if (availabilityFilter !== 'all') count++;
    if (search) count++;
    return count;
  }, [statusFilter, categoryFilter, supplierFilter, maturityFilter, efficiencyFilter, priceFilter, marginFilter, availabilityFilter, search]);

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSupplierFilter('all');
    setMaturityFilter('all');
    setEfficiencyFilter('all');
    setPriceFilter('all');
    setMarginFilter('all');
    setAvailabilityFilter('all');
    setSearch('');
  };

  // Status distribution chart data
  const statusChartData = [
    { label: 'Active', count: counts.active, color: '#047538', pct: skus.length ? Math.round(counts.active / skus.length * 100) : 0 },
    { label: 'On-Hold', count: counts['on-hold'], color: '#FFC400', pct: skus.length ? Math.round(counts['on-hold'] / skus.length * 100) : 0 },
    { label: 'Discontinued', count: counts.discontinued, color: '#D62D0B', pct: skus.length ? Math.round(counts.discontinued / skus.length * 100) : 0 },
  ];

  // Export columns for SKU table
  const skuExportColumns: ExportColumn<SKURow>[] = useMemo(() => [
    { header: 'SKU ID', key: 'skuId' },
    { header: 'Name', key: 'name' },
    { header: 'Supplier', key: 'supplier' },
    { header: 'Category', key: 'category', formatter: (val) => CATEGORIES_L0.find(c => c.id === val)?.name || String(val) },
    { header: 'Status', key: 'status', formatter: (val) => String(val).replace('-', ' ') },
    { header: 'Maturity Stage', key: 'maturityStage', formatter: (val) => String(val).replace('-', ' ') },
    { header: 'Cost Price', key: 'costPrice', formatter: (val) => Number(val).toFixed(2) },
    { header: 'Base Price', key: 'basePrice', formatter: (val) => Number(val).toFixed(2) },
    { header: 'Discount %', key: 'discount', formatter: (val) => val != null ? `${val}%` : '' },
    { header: 'Margin %', key: 'margin', formatter: (val) => `${val}%` },
    { header: 'Weekly Units Sold', key: 'weeklyUnitsSold' },
    { header: 'Availability %', key: 'availability', formatter: (val) => `${val}%` },
    { header: 'Engine Signals', key: 'engineSignals', formatter: (val) => Array.isArray(val) ? val.join(', ') : '' },
    { header: 'Warehouses In Stock', key: 'warehouses', formatter: (val) => Array.isArray(val) ? val.filter((w: { inStock: boolean }) => w.inStock).length : 0 },
  ], []);

  const handleExport = useCallback((format: 'csv' | 'xlsx') => {
    exportData(skus, skuExportColumns, generateFilename('sku-tower'), format);
  }, [skus, skuExportColumns]);

  const summaryCards = [
    { label: 'Total SKUs', value: String(skus.length), color: fg1 },
    { label: 'Avg Margin', value: (skus.reduce((a, s) => a + s.margin, 0) / (skus.length || 1)).toFixed(0) + '%', color: '#047538' },
    { label: 'Warehouse Coverage', value: (skus.reduce((a, s) => a + s.warehouses.filter(w => w.inStock).length, 0) / ((skus.length * 5) || 1) * 100).toFixed(0) + '%', color: '#4629FF' },
    { label: 'Needs Action', value: String(skus.filter(s => s.engineSignals.length > 0).length), color: '#D62D0B' },
  ];

  // Handle status change in matrix view
  const handleMatrixStatusChange = (skuId: string, warehouse: Warehouse, newStatus: SKUStatus) => {
    setSkus(prevSkus => prevSkus.map(sku => {
      if (sku.skuId === skuId) {
        return {
          ...sku,
          warehouses: sku.warehouses.map(w =>
            w.warehouse === warehouse ? { ...w, status: newStatus, inStock: newStatus === 'active' } : w
          ),
        };
      }
      return sku;
    }));
  };

  // Handle bulk status change (chain override)
  const handleBulkStatusChange = (skuId: string, newStatus: SKUStatus) => {
    setSkus(prevSkus => prevSkus.map(sku => {
      if (sku.skuId === skuId) {
        return {
          ...sku,
          status: newStatus,
          warehouses: sku.warehouses.map(w => ({
            ...w,
            status: newStatus,
            inStock: newStatus === 'active',
          })),
        };
      }
      return sku;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>SKU Control Tower</div>
          <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>End-to-end SKU visibility across all warehouses {loading && '· Loading...'}</div>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: 2, background: t ? '#1E1E20' : '#F4F5F6', borderRadius: 10, padding: 4, border: `1px solid ${t ? '#343437' : '#E9EAEC'}` }}>
          <button
            onClick={() => setViewMode('sku')}
            style={{
              padding: '10px 20px',
              border: 0,
              borderRadius: 8,
              cursor: 'pointer',
              font: `600 13px/1 ${font}`,
              background: viewMode === 'sku' ? (t ? '#343437' : '#fff') : 'transparent',
              color: viewMode === 'sku' ? fg1 : fg3,
              boxShadow: viewMode === 'sku' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 150ms',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
              SKU View
            </span>
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            style={{
              padding: '10px 20px',
              border: 0,
              borderRadius: 8,
              cursor: 'pointer',
              font: `600 13px/1 ${font}`,
              background: viewMode === 'matrix' ? (t ? '#343437' : '#fff') : 'transparent',
              color: viewMode === 'matrix' ? fg1 : fg3,
              boxShadow: viewMode === 'matrix' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 150ms',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Matrix View
            </span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {summaryCards.map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* SKU View */}
      {viewMode === 'sku' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(counts).map(([k, v]) => (
              <button key={k} onClick={() => setFilter(k)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 200, cursor: 'pointer',
                border: `1px solid ${filter === k ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`,
                background: filter === k ? (t ? 'rgba(70,41,255,0.15)' : '#EDEBFF') : 'transparent',
                color: filter === k ? '#4629FF' : fg2, font: `600 12px/1 ${font}`,
              }}>
                {k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1).replace('-', ' ')}
                <span style={{ font: `500 10px/1 ${mono}`, opacity: 0.7 }}>{v}</span>
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ExportButton onExport={handleExport} isDark={t} />
              <div style={{ position: 'relative' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: fg2 }}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKUs, suppliers…" style={{ width: 260, padding: '8px 12px 8px 32px', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ font: `700 14px/1.3 ${font}`, color: fg1, marginBottom: 12 }}>Status Distribution</div>
              <StatusDistributionChart data={statusChartData} height={140} />
            </div>
            <div style={{ ...card, padding: 20 }}>
              <div style={{ font: `700 14px/1.3 ${font}`, color: fg1, marginBottom: 8 }}>Category Breakdown</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {CATEGORIES_L0.slice(1, 7).map(cat => {
                  const catCount = skus.filter(s => s.category === cat.id).length;
                  const catPct = skus.length ? Math.round(catCount / skus.length * 100) : 0;
                  return (
                    <div key={cat.id} style={{ minWidth: 120 }}>
                      <div style={{ font: `500 11px/1 ${font}`, color: fg3 }}>{cat.name}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                        <span style={{ font: `700 18px/1 ${font}`, color: fg1 }}>{catCount}</span>
                        <span style={{ font: `500 11px/1 ${font}`, color: fg2 }}>{catPct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: selectedSKU ? '1fr 380px' : '1fr', gap: 16 }}>
            <div style={{ ...card, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t ? '#343437' : '#F4F5F6' }}>
                    {['SKU Name', 'Category', 'Status', 'Stage', 'WH', 'Cost', 'Price', 'Margin', 'Signals'].map(h => (
                      <th key={h} style={{ textAlign: h === 'Cost' || h === 'Price' || h === 'Margin' ? 'right' : h === 'WH' || h === 'Signals' ? 'center' : 'left', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {skus.map(row => {
                    const ss = statusStyle[row.status] || statusStyle.active;
                    const ms = maturityStyle[row.maturityStage] || maturityStyle.mature;
                    const active = selectedSKU?.skuId === row.skuId;
                    return (
                      <tr
                        key={row.skuId}
                        onClick={() => setSelectedSKU(row)}
                        style={{
                          borderBottom: `1px solid ${t ? '#343437' : '#F4F5F6'}`,
                          cursor: 'pointer',
                          background: active ? (t ? 'rgba(70,41,255,0.06)' : 'rgba(70,41,255,0.02)') : 'transparent',
                        }}
                      >
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{row.name}</div>
                          <div style={{ font: `500 11px/1.3 ${font}`, color: fg3 }}>{row.supplier}</div>
                        </td>
                        <td style={{ padding: '12px 14px', font: `500 12px/1 ${font}`, color: fg2 }}>{CATEGORIES_L0.find(c => c.id === row.category)?.name || row.category}</td>
                        <td style={{ padding: '12px 14px' }}><span style={{ background: t ? `${ss.fg}18` : ss.bg, color: ss.fg, font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{row.status.replace('-', ' ')}</span></td>
                        <td style={{ padding: '12px 14px' }}><span style={{ background: t ? `${ms.fg}18` : ms.bg, color: ms.fg, font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{row.maturityStage.replace('-', ' ')}</span></td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                            {row.warehouses.map((w, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: w.inStock ? '#047538' : (t ? '#434347' : '#E9EAEC') }} title={`${w.warehouse}: ${w.quantity}`} />)}
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.costPrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.basePrice.toFixed(2)}{row.discount ? <span style={{ color: '#D62D0B', fontSize: 10, marginLeft: 4 }}>-{row.discount}%</span> : null}</td>
                        <td style={{ padding: '12px 14px', font: `600 12px/1 ${mono}`, color: row.margin >= 30 ? '#047538' : row.margin >= 20 ? '#8F5D00' : '#D62D0B', textAlign: 'right' }}>{row.margin}%</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                            {row.engineSignals.map((s, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: engineDots[s] || '#93949D', display: 'inline-block' }} title={s} />)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedSKU && (
              <SKUDrilldownPanel
                sku={selectedSKU}
                onClose={() => setSelectedSKU(null)}
                onUpdateStatus={(warehouse, status) => {
                  setSkus(prevSkus => prevSkus.map(sku => {
                    if (sku.skuId === selectedSKU.skuId) {
                      return {
                        ...sku,
                        warehouses: sku.warehouses.map(w =>
                          w.warehouse === warehouse ? { ...w, status, inStock: status === 'active' } : w
                        ),
                      };
                    }
                    return sku;
                  }));
                }}
                onUpdateClusterStatus={(clusterId, status) => {
                  const cluster = WAREHOUSE_CLUSTERS.find(c => c.id === clusterId);
                  if (cluster) {
                    setSkus(prevSkus => prevSkus.map(sku => {
                      if (sku.skuId === selectedSKU.skuId) {
                        return {
                          ...sku,
                          warehouses: sku.warehouses.map(w =>
                            cluster.warehouses.includes(w.warehouse)
                              ? { ...w, status, inStock: status === 'active' }
                              : w
                          ),
                        };
                      }
                      return sku;
                    }));
                  }
                }}
              />
            )}
          </div>
        </>
      )}

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <>
          {/* Filters Bar - Row 1: Primary Filters */}
          <div style={{ ...card, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: showAdvancedFilters ? 12 : 0 }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: fg2 }}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search SKUs, suppliers…"
                  style={{ width: 200, padding: '8px 12px 8px 32px', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, outline: 'none' }}
                />
              </div>

              {/* SKU Status */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '8px 28px 8px 10px', border: `1px solid ${statusFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
              >
                <option value="all">All Status</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Category */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ padding: '8px 28px 8px 10px', border: `1px solid ${categoryFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
              >
                <option value="all">All Categories</option>
                {CATEGORIES_L0.slice(1).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* Supplier */}
              <select
                value={supplierFilter}
                onChange={e => setSupplierFilter(e.target.value)}
                style={{ padding: '8px 28px 8px 10px', border: `1px solid ${supplierFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
              >
                <option value="all">All Suppliers</option>
                {suppliers.map(sup => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>

              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    border: `1px solid ${showAdvancedFilters ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`,
                    borderRadius: 8,
                    background: showAdvancedFilters ? (t ? 'rgba(70,41,255,0.15)' : '#EDEBFF') : 'transparent',
                    color: showAdvancedFilters ? '#4629FF' : fg2,
                    font: `600 12px/1 ${font}`,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span style={{ background: '#4629FF', color: '#fff', font: `600 10px/1 ${font}`, padding: '2px 6px', borderRadius: 10 }}>{activeFilterCount}</span>
                  )}
                </button>

                <span style={{ font: `500 12px/1 ${font}`, color: fg3 }}>
                  {filteredSkus.length} of {skus.length} SKUs
                </span>
                <ExportButton onExport={handleExport} isDark={t} />
              </div>
            </div>

            {/* Advanced Filters Row */}
            {showAdvancedFilters && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 12, borderTop: `1px solid ${t ? '#343437' : '#E9EAEC'}` }}>
                {/* Maturity Stage */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ font: `500 10px/1 ${font}`, color: fg3 }}>Maturity Stage</label>
                  <select
                    value={maturityFilter}
                    onChange={e => setMaturityFilter(e.target.value)}
                    style={{ padding: '8px 28px 8px 10px', border: `1px solid ${maturityFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
                  >
                    {MATURITY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Efficiency */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ font: `500 10px/1 ${font}`, color: fg3 }}>Efficiency</label>
                  <select
                    value={efficiencyFilter}
                    onChange={e => setEfficiencyFilter(e.target.value)}
                    style={{ padding: '8px 28px 8px 10px', border: `1px solid ${efficiencyFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
                  >
                    {EFFICIENCY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Selling Price */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ font: `500 10px/1 ${font}`, color: fg3 }}>Selling Price</label>
                  <select
                    value={priceFilter}
                    onChange={e => setPriceFilter(e.target.value)}
                    style={{ padding: '8px 28px 8px 10px', border: `1px solid ${priceFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
                  >
                    {PRICE_RANGES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Margin */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ font: `500 10px/1 ${font}`, color: fg3 }}>Margin</label>
                  <select
                    value={marginFilter}
                    onChange={e => setMarginFilter(e.target.value)}
                    style={{ padding: '8px 28px 8px 10px', border: `1px solid ${marginFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
                  >
                    {MARGIN_RANGES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Availability */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label style={{ font: `500 10px/1 ${font}`, color: fg3 }}>Availability</label>
                  <select
                    value={availabilityFilter}
                    onChange={e => setAvailabilityFilter(e.target.value)}
                    style={{ padding: '8px 28px 8px 10px', border: `1px solid ${availabilityFilter !== 'all' ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`, borderRadius: 8, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 12px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}
                  >
                    {AVAILABILITY_RANGES.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 12px',
                      border: '1px solid #D62D0B',
                      borderRadius: 8,
                      background: t ? 'rgba(214,45,11,0.1)' : '#FCEBE8',
                      color: '#D62D0B',
                      font: `600 12px/1 ${font}`,
                      cursor: 'pointer',
                      marginTop: 16,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Matrix Display Mode Toggle & Legend */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
            {/* Display Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ font: `600 11px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Show:</span>
              <div style={{ display: 'flex', gap: 2, background: t ? '#1E1E20' : '#F4F5F6', borderRadius: 6, padding: 2, border: `1px solid ${t ? '#343437' : '#E9EAEC'}` }}>
                {[
                  { value: 'price', label: 'Price', icon: '💰' },
                  { value: 'status', label: 'Status', icon: '📊' },
                  { value: 'quantity', label: 'Qty', icon: '📦' },
                ].map(mode => (
                  <button
                    key={mode.value}
                    onClick={() => setMatrixDisplayMode(mode.value as 'status' | 'price' | 'quantity')}
                    style={{
                      padding: '6px 12px',
                      border: 0,
                      borderRadius: 4,
                      cursor: 'pointer',
                      font: `600 11px/1 ${font}`,
                      background: matrixDisplayMode === mode.value ? (t ? '#343437' : '#fff') : 'transparent',
                      color: matrixDisplayMode === mode.value ? fg1 : fg3,
                      boxShadow: matrixDisplayMode === mode.value ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 150ms',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span>{mode.icon}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            {matrixDisplayMode === 'status' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {STATUS_OPTIONS.map(opt => {
                  const ss = statusStyle[opt.value];
                  return (
                    <span key={opt.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: ss.bg, border: `1px solid ${ss.fg}30` }} />
                      <span style={{ font: `500 10px/1 ${font}`, color: fg2 }}>{opt.label}</span>
                    </span>
                  );
                })}
              </div>
            )}
            {matrixDisplayMode === 'price' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ font: `500 10px/1 ${font}`, color: fg2 }}>💰 Price shown in AED per unit</span>
              </div>
            )}
            {matrixDisplayMode === 'quantity' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#047538' }} />
                  <span style={{ font: `500 10px/1 ${font}`, color: fg2 }}>In Stock</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#D62D0B' }} />
                  <span style={{ font: `500 10px/1 ${font}`, color: fg2 }}>Out of Stock</span>
                </span>
              </div>
            )}
          </div>

          {/* Matrix Table */}
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr style={{ background: t ? '#343437' : '#F4F5F6' }}>
                    <th style={{ textAlign: 'left', padding: '12px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', position: 'sticky', left: 0, background: t ? '#343437' : '#F4F5F6', zIndex: 10, minWidth: 200 }}>SKU / Supplier</th>
                    <th style={{ textAlign: 'center', padding: '12px 8px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: 100 }}>All Warehouses</th>
                    {UAE_WAREHOUSES.map(wh => (
                      <th key={wh} style={{ textAlign: 'center', padding: '12px 8px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: 100 }}>
                        <div>{wh.split(' ')[0]}</div>
                        <div style={{ font: `500 9px/1 ${font}`, color: fg3, opacity: 0.7, marginTop: 2 }}>{wh.split(' ').slice(1).join(' ')}</div>
                      </th>
                    ))}
                    <th style={{ textAlign: 'right', padding: '12px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: 80 }}>Margin</th>
                    <th style={{ textAlign: 'right', padding: '12px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', minWidth: 80 }}>Units/Wk</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSkus.map((row, idx) => {
                    // Calculate overall status for "All Warehouses"
                    const allActive = row.warehouses.every(w => w.status === 'active' && w.inStock);
                    const anyOnHold = row.warehouses.some(w => w.status === 'on-hold');
                    const overallStatus: SKUStatus = allActive ? 'active' : anyOnHold ? 'on-hold' : 'discontinued';
                    const oss = statusStyle[overallStatus] || statusStyle.active;

                    return (
                      <tr
                        key={row.skuId}
                        style={{
                          borderBottom: `1px solid ${t ? '#343437' : '#F4F5F6'}`,
                          background: idx % 2 === 0 ? 'transparent' : (t ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'),
                        }}
                      >
                        {/* SKU Name Cell */}
                        <td style={{ padding: '10px 14px', position: 'sticky', left: 0, background: t ? (idx % 2 === 0 ? '#1E1E20' : '#202022') : (idx % 2 === 0 ? '#fff' : '#FAFAFA'), zIndex: 5 }}>
                          <div style={{ font: `600 12px/1.3 ${font}`, color: fg1 }}>{row.name}</div>
                          <div style={{ font: `500 10px/1.3 ${font}`, color: fg3, marginTop: 2 }}>{row.supplier} · {row.skuId}</div>
                        </td>

                        {/* All Warehouses Cell */}
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          {matrixDisplayMode === 'price' ? (
                            <div style={{
                              font: `700 12px/1 ${mono}`,
                              color: fg1,
                              background: t ? 'rgba(70,41,255,0.1)' : '#EDEBFF',
                              padding: '6px 8px',
                              borderRadius: 6,
                            }}>
                              {row.discount ? (
                                <>
                                  <span style={{ textDecoration: 'line-through', opacity: 0.5, marginRight: 4 }}>{row.basePrice.toFixed(2)}</span>
                                  <span style={{ color: '#D62D0B' }}>{(row.basePrice * (1 - row.discount / 100)).toFixed(2)}</span>
                                </>
                              ) : row.basePrice.toFixed(2)}
                            </div>
                          ) : matrixDisplayMode === 'quantity' ? (
                            <div style={{
                              font: `700 12px/1 ${mono}`,
                              color: '#047538',
                              background: t ? 'rgba(4,117,56,0.15)' : '#E5F5EC',
                              padding: '6px 8px',
                              borderRadius: 6,
                            }}>
                              {row.warehouses.reduce((sum, w) => sum + w.quantity, 0).toLocaleString()}
                            </div>
                          ) : (
                            <select
                              value={overallStatus}
                              onChange={(e) => handleBulkStatusChange(row.skuId, e.target.value as SKUStatus)}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: 0,
                                borderRadius: 6,
                                cursor: 'pointer',
                                font: `600 10px/1 ${font}`,
                                background: t ? `${oss.fg}25` : oss.bg,
                                color: oss.fg,
                                appearance: 'none',
                                textAlign: 'center',
                              }}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          )}
                        </td>

                        {/* Warehouse Cells */}
                        {UAE_WAREHOUSES.map(wh => {
                          const whData = row.warehouses.find(w => w.warehouse === wh);
                          const status = whData?.status || 'active';
                          const inStock = whData?.inStock ?? false;
                          const quantity = whData?.quantity || 0;
                          const lastUpdated = whData?.lastUpdated || 'N/A';
                          const ss = statusStyle[status] || statusStyle.active;
                          const isHovered = hoveredCell?.skuId === row.skuId && hoveredCell?.warehouse === wh;

                          return (
                            <td
                              key={wh}
                              style={{ padding: '8px', textAlign: 'center', position: 'relative' }}
                              onMouseEnter={() => setHoveredCell({ skuId: row.skuId, warehouse: wh })}
                              onMouseLeave={() => setHoveredCell(null)}
                            >
                              {matrixDisplayMode === 'price' ? (
                                // Price Display
                                <div style={{
                                  font: `700 12px/1 ${mono}`,
                                  color: inStock ? fg1 : fg3,
                                  background: inStock
                                    ? (t ? 'rgba(70,41,255,0.08)' : 'rgba(70,41,255,0.05)')
                                    : (t ? 'rgba(107,109,115,0.1)' : '#F4F5F6'),
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                  opacity: inStock ? 1 : 0.5,
                                  textDecoration: inStock ? 'none' : 'line-through',
                                }}>
                                  {row.discount ? (
                                    <span style={{ color: '#D62D0B' }}>
                                      {(row.basePrice * (1 - row.discount / 100)).toFixed(2)}
                                    </span>
                                  ) : row.basePrice.toFixed(2)}
                                </div>
                              ) : matrixDisplayMode === 'quantity' ? (
                                // Quantity Display
                                <div style={{
                                  font: `700 12px/1 ${mono}`,
                                  color: inStock ? '#047538' : '#D62D0B',
                                  background: inStock
                                    ? (t ? 'rgba(4,117,56,0.15)' : '#E5F5EC')
                                    : (t ? 'rgba(214,45,11,0.15)' : '#FCEBE8'),
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                }}>
                                  {inStock ? quantity.toLocaleString() : 'OOS'}
                                </div>
                              ) : (
                                // Status Dropdown
                                <select
                                  value={status}
                                  onChange={(e) => handleMatrixStatusChange(row.skuId, wh, e.target.value as SKUStatus)}
                                  style={{
                                    width: '100%',
                                    padding: '6px 8px',
                                    border: 0,
                                    borderRadius: 6,
                                    cursor: 'pointer',
                                    font: `600 10px/1 ${font}`,
                                    background: t ? `${ss.fg}25` : ss.bg,
                                    color: ss.fg,
                                    appearance: 'none',
                                    textAlign: 'center',
                                  }}
                                >
                                  {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              )}

                              {/* Tooltip */}
                              {isHovered && (
                                <div style={{
                                  position: 'absolute',
                                  bottom: '100%',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  marginBottom: 8,
                                  padding: '10px 12px',
                                  background: t ? '#343437' : '#1f2937',
                                  color: '#fff',
                                  borderRadius: 8,
                                  fontSize: 11,
                                  whiteSpace: 'nowrap',
                                  zIndex: 100,
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                }}>
                                  <div style={{ font: `600 12px/1.3 ${font}`, marginBottom: 6 }}>{wh}</div>
                                  <div style={{ display: 'grid', gap: 4 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                                      <span style={{ opacity: 0.7 }}>Price:</span>
                                      <span style={{ font: `600 11px/1 ${font}` }}>AED {row.discount ? (row.basePrice * (1 - row.discount / 100)).toFixed(2) : row.basePrice.toFixed(2)}{row.discount && <span style={{ color: '#A2FAA3', marginLeft: 4 }}>(-{row.discount}%)</span>}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                                      <span style={{ opacity: 0.7 }}>Status:</span>
                                      <span style={{ font: `600 11px/1 ${font}` }}>{status.replace('-', ' ')}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                                      <span style={{ opacity: 0.7 }}>Stock:</span>
                                      <span style={{ font: `600 11px/1 ${font}`, color: inStock ? '#A2FAA3' : '#fca5a5' }}>{inStock ? `${quantity} units` : 'Out of stock'}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                                      <span style={{ opacity: 0.7 }}>Updated:</span>
                                      <span style={{ font: `500 11px/1 ${font}` }}>{lastUpdated}</span>
                                    </div>
                                  </div>
                                  <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '6px solid transparent', borderTopColor: t ? '#343437' : '#1f2937' }} />
                                </div>
                              )}
                            </td>
                          );
                        })}

                        {/* Margin */}
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <span style={{ font: `700 12px/1 ${mono}`, color: row.margin >= 30 ? '#047538' : row.margin >= 20 ? '#8F5D00' : '#D62D0B' }}>
                            {row.margin}%
                          </span>
                        </td>

                        {/* Weekly Units */}
                        <td style={{ padding: '10px 14px', textAlign: 'right', font: `500 12px/1 ${mono}`, color: fg2 }}>
                          {row.weeklyUnitsSold.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: `1px solid ${t ? '#343437' : '#E9EAEC'}` }}>
              <span style={{ font: `500 12px/1 ${font}`, color: fg3 }}>1-{filteredSkus.length} of {skus.length} items</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button style={{ padding: '6px 12px', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 6, background: 'transparent', color: fg2, font: `500 11px/1 ${font}`, cursor: 'pointer' }}>Prev</button>
                <button style={{ padding: '6px 12px', border: '1px solid #4629FF', borderRadius: 6, background: '#4629FF', color: '#fff', font: `600 11px/1 ${font}`, cursor: 'pointer' }}>1</button>
                <button style={{ padding: '6px 12px', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 6, background: 'transparent', color: fg2, font: `500 11px/1 ${font}`, cursor: 'pointer' }}>Next</button>
                <select style={{ marginLeft: 8, padding: '6px 28px 6px 8px', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 6, background: t ? '#1E1E20' : '#fff', color: fg1, font: `500 11px/1 ${font}`, cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', backgroundSize: '14px' }}>
                  <option>20 / page</option>
                  <option>50 / page</option>
                  <option>100 / page</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}