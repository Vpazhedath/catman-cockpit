'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { SAMPLE_SKUS, Warehouse, SKUStatus, WAREHOUSE_CLUSTERS } from '@/lib/sample-data';
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

const statusStyle: Record<string, { bg: string; fg: string }> = { active: { bg: '#E5F5EC', fg: '#047538' }, 'on-hold': { bg: '#FFF8DF', fg: '#8F5D00' }, discontinued: { bg: '#FCEBE8', fg: '#BF280A' }, 'phase-out': { bg: '#FCEBE8', fg: '#BF280A' } };
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

export default function SKUControlTowerPage() {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [skus, setSkus] = useState<SKURow[]>(SAMPLE_SKUS);
  const [loading, setLoading] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKURow | null>(null);

  const card: React.CSSProperties = { background: t ? '#1E1E20' : '#fff', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 12 };
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';

  // Fetch SKUs from API when filter/search changes
  useEffect(() => {
    const fetchSKUs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filter !== 'all') params.append('status', filter);
        if (search) params.append('search', search);
        params.append('limit', '50');

        const res = await fetch(`/api/skus?${params}`);
        if (res.ok) {
          const data = await res.json();
          setSkus(data.length > 0 ? data : SAMPLE_SKUS);
        }
      } catch (error) {
        console.error('Failed to fetch SKUs:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(fetchSKUs, 300);
    return () => clearTimeout(timer);
  }, [filter, search]);

  const counts = { all: skus.length, active: skus.filter(s => s.status === 'active').length, 'on-hold': skus.filter(s => s.status === 'on-hold').length, discontinued: skus.filter(s => s.status === 'discontinued').length };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>SKU Control Tower</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>End-to-end SKU visibility across all warehouses {loading && '· Loading...'}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {summaryCards.map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

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
                    onDoubleClick={() => setSelectedSKU(row)}
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
              // Update the SKU's warehouse status
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
              // Find the cluster and update all its warehouses
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
    </div>
  );
}