'use client';

import { useState, useMemo } from 'react';
import { SAMPLE_SKUS, RELEVANT_SKUS } from '@/lib/sample-data';

const CATEGORIES_L0 = [
  { id: 'all', name: 'All Categories' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'dairy-chilled-eggs', name: 'Dairy & Eggs' },
  { id: 'snacks', name: 'Snacks & Confectionery' },
  { id: 'personal-care-baby-health', name: 'Personal Care' },
  { id: 'home-pet', name: 'Home & Pet' },
  { id: 'frozen', name: 'Frozen Foods' },
  { id: 'packaged-foods', name: 'Packaged Foods' },
];

const statusStyle: Record<string, { bg: string; fg: string }> = {
  active: { bg: '#E5F5EC', fg: '#047538' },
  'on-hold': { bg: '#FFF8DF', fg: '#8F5D00' },
  discontinued: { bg: '#FCEBE8', fg: '#BF280A' },
  retired: { bg: '#F4F5F6', fg: '#93949D' },
};
const maturityStyle: Record<string, { bg: string; fg: string }> = {
  mature: { bg: '#E5F5EC', fg: '#047538' },
  probation: { bg: '#EDEBFF', fg: '#3A22D5' },
  review: { bg: '#FFF8DF', fg: '#8F5D00' },
  'phase-out': { bg: '#FCEBE8', fg: '#BF280A' },
  new: { bg: '#EDEBFF', fg: '#4629FF' },
};
const engineDots: Record<string, string> = { choice: '#4629FF', affordability: '#FFC400', lifecycle: '#6635B6', profitability: '#047538' };

const fg1 = '#141415';
const fg2 = '#6C6D73';
const fg3 = '#93949D';
const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E9EAEC', borderRadius: 12 };

export default function SKUControlTowerPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  type SKURow = typeof RELEVANT_SKUS[number];
  const [selectedSKU, setSelectedSKU] = useState<SKURow | null>(null);

  const baseData = RELEVANT_SKUS;
  const counts: Record<string, number> = {
    all: baseData.length,
    active: baseData.filter(s => s.status === 'active').length,
    'on-hold': baseData.filter(s => s.status === 'on-hold').length,
    discontinued: baseData.filter(s => s.status === 'discontinued').length,
  };

  const filtered = useMemo(() => {
    let d = [...baseData];
    if (filter !== 'all') d = d.filter(s => s.status === filter);
    if (search) { const q = search.toLowerCase(); d = d.filter(s => s.name.toLowerCase().includes(q) || s.supplier.toLowerCase().includes(q)); }
    return d;
  }, [filter, search, baseData]);

  const summaryCards = [
    { label: 'Total SKUs', value: String(filtered.length), color: fg1 },
    { label: 'Avg Margin', value: (filtered.reduce((a, s) => a + s.margin, 0) / (filtered.length || 1)).toFixed(0) + '%', color: '#047538' },
    { label: 'Warehouse Coverage', value: (filtered.reduce((a, s) => a + s.warehouses.filter(w => w.inStock).length, 0) / ((filtered.length * 5) || 1) * 100).toFixed(0) + '%', color: '#4629FF' },
    { label: 'Needs Action', value: String(filtered.filter(s => s.engineSignals.length > 0).length), color: '#D62D0B' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>SKU Control Tower</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>End-to-end SKU visibility across all warehouses</div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {summaryCards.map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 200, cursor: 'pointer',
            border: `1px solid ${filter === k ? '#4629FF' : '#E9EAEC'}`,
            background: filter === k ? '#EDEBFF' : 'transparent',
            color: filter === k ? '#4629FF' : fg2,
            font: `600 12px/1 ${font}`,
          }}>
            {k === 'all' ? 'All' : k.charAt(0).toUpperCase() + k.slice(1).replace('-', ' ')}
            <span style={{ font: `500 10px/1 ${mono}`, opacity: 0.7 }}>{v}</span>
          </button>
        ))}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: fg2 }}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search SKUs, suppliers…" style={{ width: 260, padding: '8px 12px 8px 32px', border: '1px solid #E9EAEC', borderRadius: 8, background: '#fff', color: fg1, font: `500 12px/1 ${font}`, outline: 'none' }} />
        </div>
      </div>

      {/* Table + Detail panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedSKU ? '1fr 380px' : '1fr', gap: 16 }}>
        <div style={{ ...card, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F4F5F6' }}>
                {['SKU Name', 'Category', 'Status', 'Stage', 'WH', 'Cost', 'Price', 'Margin', 'Signals'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Cost' || h === 'Price' || h === 'Margin' ? 'right' : h === 'WH' || h === 'Signals' ? 'center' : 'left', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => {
                const ss = statusStyle[row.status] || statusStyle.active;
                const ms = maturityStyle[row.maturityStage] || maturityStyle.mature;
                const active = selectedSKU?.skuId === row.skuId;
                return (
                  <tr key={row.skuId} onClick={() => setSelectedSKU(row)} style={{ borderBottom: '1px solid #F4F5F6', cursor: 'pointer', background: active ? 'rgba(70,41,255,0.02)' : 'transparent' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{row.name}</div>
                      <div style={{ font: `500 11px/1.3 ${font}`, color: fg3 }}>{row.supplier}</div>
                    </td>
                    <td style={{ padding: '12px 14px', font: `500 12px/1 ${font}`, color: fg2 }}>{CATEGORIES_L0.find(c => c.id === row.category)?.name || row.category}</td>
                    <td style={{ padding: '12px 14px' }}><span style={{ background: ss.bg, color: ss.fg, font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{row.status.replace('-', ' ')}</span></td>
                    <td style={{ padding: '12px 14px' }}><span style={{ background: ms.bg, color: ms.fg, font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{row.maturityStage.replace('-', ' ')}</span></td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {row.warehouses.map((w, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: w.inStock ? '#047538' : '#E9EAEC' }} title={`${w.warehouse}: ${w.quantity}`} />)}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.costPrice.toFixed(2)}</td>
                    <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>
                      {row.basePrice.toFixed(2)}
                      {row.discount ? <span style={{ color: '#D62D0B', fontSize: 10, marginLeft: 4 }}>-{row.discount}%</span> : null}
                    </td>
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

        {/* Detail drawer */}
        {selectedSKU && (
          <div style={{ ...card, padding: 20, height: 'fit-content', position: 'sticky', top: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ font: `700 18px/1.3 ${font}`, color: fg1 }}>{selectedSKU.name}</div>
                <div style={{ font: `500 12px/1.3 ${font}`, color: fg2, marginTop: 2 }}>{selectedSKU.supplier} · {selectedSKU.skuId}</div>
              </div>
              <button onClick={() => setSelectedSKU(null)} style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 4, font: `500 16px/1 ${font}`, color: fg3 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { l: 'Cost', v: `AED ${selectedSKU.costPrice.toFixed(2)}` },
                { l: 'Price', v: `AED ${selectedSKU.basePrice.toFixed(2)}` },
                { l: 'Margin', v: `${selectedSKU.margin}%` },
                { l: 'Weekly units', v: selectedSKU.weeklyUnitsSold.toLocaleString() },
              ].map((x, i) => (
                <div key={i} style={{ background: '#F4F5F6', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ font: `500 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{x.l}</div>
                  <div style={{ font: `700 16px/1.2 ${font}`, color: fg1, marginTop: 4 }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{ font: `600 11px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Warehouse distribution</div>
            {selectedSKU.warehouses.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < selectedSKU.warehouses.length - 1 ? '1px solid #F4F5F6' : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: w.inStock ? '#047538' : '#D62D0B', flexShrink: 0 }} />
                <div style={{ flex: 1, font: `500 12px/1.3 ${font}`, color: fg1 }}>{w.warehouse}</div>
                <div style={{ font: `500 11px/1 ${mono}`, color: w.inStock ? fg2 : '#D62D0B' }}>{w.inStock ? `${w.quantity} units` : 'OOS'}</div>
              </div>
            ))}
            {selectedSKU.engineSignals.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ font: `600 11px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>Engine signals</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedSKU.engineSignals.map((s, i) => <span key={i} style={{ background: '#EDEBFF', color: '#4629FF', font: `600 11px/1 ${font}`, padding: '5px 10px', borderRadius: 200, textTransform: 'capitalize' }}>{s}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
