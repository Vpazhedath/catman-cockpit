'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COMPETITOR_PRICES = [
  { sku: 'Almarai Full Cream 1L', ourPrice: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75, gap: '+3%', status: 'competitive' as const, category: 'dairy-chilled-eggs' },
  { sku: 'Lacnor Orange Juice 1L', ourPrice: 6.00, carrefour: 5.50, lulu: 5.75, noon: 6.25, gap: '+9%', status: 'high' as const, category: 'beverages' },
  { sku: 'Nestle Pure Life 1.5L', ourPrice: 2.00, carrefour: 1.75, lulu: 1.85, noon: 2.10, gap: '+14%', status: 'high' as const, category: 'beverages' },
  { sku: 'Coca-Cola 330ml Can', ourPrice: 3.25, carrefour: 3.50, lulu: 3.25, noon: 3.50, gap: '-7%', status: 'low' as const, category: 'beverages' },
  { sku: 'Red Bull 250ml', ourPrice: 7.00, carrefour: 6.50, lulu: 6.75, noon: 7.25, gap: '+8%', status: 'high' as const, category: 'beverages' },
  { sku: 'Barakat Fresh Milk 2L', ourPrice: 11.00, carrefour: 10.50, lulu: 11.00, noon: 11.50, gap: '+5%', status: 'competitive' as const, category: 'dairy-chilled-eggs' },
  { sku: 'Almarai Laban 200ml', ourPrice: 1.80, carrefour: 1.75, lulu: 1.80, noon: 1.90, gap: '+3%', status: 'competitive' as const, category: 'dairy-chilled-eggs' },
  { sku: 'Sunkist Lemon 330ml', ourPrice: 3.50, carrefour: 3.25, lulu: 3.50, noon: 3.75, gap: '+8%', status: 'high' as const, category: 'beverages' },
];

const PROMO_RECOMMENDATIONS = [
  { sku: 'Lacnor Orange Juice 1L', type: 'Price Match', suggested: 'AED 5.50', reason: '9% above Carrefour', impact: 'Est. +320 orders/week', confidence: 92 },
  { sku: 'Nestle Pure Life 1.5L', type: 'Flash Sale', suggested: 'AED 1.75 (-13%)', reason: '14% above market avg', impact: 'Est. +580 orders/week', confidence: 88 },
  { sku: 'Red Bull 250ml', type: 'Bundle Deal', suggested: '3 for AED 18', reason: 'High margin, competitive gap', impact: 'Est. +210 orders/week', confidence: 85 },
  { sku: 'Sunkist Lemon 330ml', type: 'Price Match', suggested: 'AED 3.25', reason: '8% above Carrefour', impact: 'Est. +150 orders/week', confidence: 78 },
];

const PRICE_HISTORY = [
  { date: 'Mon', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
  { date: 'Tue', our: 7.50, carrefour: 7.25, lulu: 7.45, noon: 7.75 },
  { date: 'Wed', our: 7.50, carrefour: 7.20, lulu: 7.45, noon: 7.70 },
  { date: 'Thu', our: 7.50, carrefour: 7.20, lulu: 7.50, noon: 7.70 },
  { date: 'Fri', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
  { date: 'Sat', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
  { date: 'Sun', our: 7.50, carrefour: 7.25, lulu: 7.50, noon: 7.75 },
];

type PriceFilter = 'all' | 'high' | 'low' | 'competitive';
const statusBadge: Record<string, { bg: string; fg: string; label: string }> = {
  competitive: { bg: '#E5F5EC', fg: '#047538', label: 'Competitive' },
  high: { bg: '#FCEBE8', fg: '#BF280A', label: 'Above market' },
  low: { bg: '#E5F5EC', fg: '#047538', label: 'Below market' },
};

const fg1 = '#141415';
const fg2 = '#6C6D73';
const fg3 = '#93949D';
const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E9EAEC', borderRadius: 12 };

export default function PricePage() {
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [appliedPromos, setAppliedPromos] = useState<string[]>([]);

  const stats = {
    all: COMPETITOR_PRICES.length,
    competitive: COMPETITOR_PRICES.filter(p => p.status === 'competitive').length,
    high: COMPETITOR_PRICES.filter(p => p.status === 'high').length,
    low: COMPETITOR_PRICES.filter(p => p.status === 'low').length,
  };

  const filtered = useMemo(() => {
    if (priceFilter === 'all') return COMPETITOR_PRICES;
    return COMPETITOR_PRICES.filter(p => p.status === priceFilter);
  }, [priceFilter]);

  const handleApply = (sku: string) => setAppliedPromos(prev => [...prev, sku]);

  const summaryCards = [
    { label: 'Price Competitiveness', value: '72%', color: fg1, sub: `${stats.competitive} of ${stats.all} SKUs competitive` },
    { label: 'Avg Price Gap', value: '+4.2%', color: '#D62D0B', sub: '↓ 0.8% from last week' },
    { label: 'Above Market', value: String(stats.high), color: '#8F5D00', sub: 'Est. AED 12K lost revenue/week' },
    { label: 'Promo Opportunities', value: String(PROMO_RECOMMENDATIONS.length), color: '#4629FF', sub: 'Est. +1,260 orders/week' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Affordability</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Affordability Engine · Competitor monitoring & promo recommendations</div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {summaryCards.map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.color, marginTop: 6 }}>{s.value}</div>
            <div style={{ font: `500 11px/1.3 ${font}`, color: fg3, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {(['all', 'high', 'competitive', 'low'] as PriceFilter[]).map(k => {
          const active = priceFilter === k;
          const labels: Record<PriceFilter, string> = { all: 'All', high: 'Above Market', competitive: 'Competitive', low: 'Below Market' };
          return (
            <button key={k} onClick={() => setPriceFilter(k)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 200, cursor: 'pointer',
              border: `1px solid ${active ? '#4629FF' : '#E9EAEC'}`,
              background: active ? '#EDEBFF' : 'transparent',
              color: active ? '#4629FF' : fg2,
              font: `600 12px/1 ${font}`,
            }}>
              {labels[k]}
              {k !== 'all' && <span style={{ font: `500 10px/1 ${mono}`, opacity: 0.7 }}>{stats[k]}</span>}
            </button>
          );
        })}
      </div>

      {/* Price History Chart */}
      <div style={{ ...card, padding: 20 }}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Price History: Almarai Full Cream 1L</div>
        <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 20 }}>Last 7 days competitor tracking</div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PRICE_HISTORY}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: fg3 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: fg3 }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip formatter={(value) => typeof value === 'number' ? `AED ${value.toFixed(2)}` : value} contentStyle={{ background: '#fff', border: '1px solid #E9EAEC', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="our" stroke="#4629FF" strokeWidth={2} dot={{ fill: '#4629FF', r: 3 }} name="Our Price" />
              <Line type="monotone" dataKey="carrefour" stroke="#D62D0B" strokeWidth={2} dot={{ fill: '#D62D0B', r: 3 }} name="Carrefour" />
              <Line type="monotone" dataKey="lulu" stroke="#047538" strokeWidth={2} dot={{ fill: '#047538', r: 3 }} name="Lulu" />
              <Line type="monotone" dataKey="noon" stroke="#8F5D00" strokeWidth={2} dot={{ fill: '#8F5D00', r: 3 }} name="Noon" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Competitor Price Comparison Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9EAEC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>Competitor Price Comparison</div>
            <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginTop: 2 }}>Last updated: Today</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F5F6' }}>
              {['SKU', 'Our Price', 'Carrefour', 'Lulu', 'Noon', 'Gap', 'Status', 'Action'].map(h => (
                <th key={h} style={{ textAlign: h === 'SKU' ? 'left' : h === 'Status' || h === 'Action' ? 'center' : 'right', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, idx) => {
              const sb = statusBadge[row.status] || statusBadge.competitive;
              return (
                <tr key={idx} style={{ borderBottom: '1px solid #F4F5F6' }}>
                  <td style={{ padding: '12px 14px', font: `600 13px/1.3 ${font}`, color: fg1 }}>{row.sku}</td>
                  <td style={{ padding: '12px 14px', font: `600 12px/1 ${mono}`, color: fg1, textAlign: 'right' }}>AED {row.ourPrice.toFixed(2)}</td>
                  <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.carrefour.toFixed(2)}</td>
                  <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.lulu.toFixed(2)}</td>
                  <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.noon.toFixed(2)}</td>
                  <td style={{ padding: '12px 14px', font: `600 12px/1 ${mono}`, color: row.gap.startsWith('+') ? '#D62D0B' : '#047538', textAlign: 'right' }}>{row.gap}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ background: sb.bg, color: sb.fg, font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, whiteSpace: 'nowrap' }}>{sb.label}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {row.status === 'high' && (
                      <button style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #E9EAEC', background: '#fff', color: '#4629FF', font: `600 11px/1 ${font}`, cursor: 'pointer' }}>Match</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Promo Recommendations */}
      <div style={{ ...card, padding: 20 }}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Promo Recommendations</div>
        <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 16 }}>{PROMO_RECOMMENDATIONS.length} suggestions from Affordability Engine</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROMO_RECOMMENDATIONS.map((promo, idx) => {
            const applied = appliedPromos.includes(promo.sku);
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px', borderRadius: 10, border: applied ? '1px solid #047538' : '1px solid #E9EAEC', background: applied ? '#E5F5EC20' : 'transparent' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{promo.sku}</span>
                    <span style={{ background: '#EDEBFF', color: '#4629FF', font: `600 10px/1 ${font}`, padding: '3px 8px', borderRadius: 200 }}>{promo.type}</span>
                    {applied && <span style={{ background: '#E5F5EC', color: '#047538', font: `600 10px/1 ${font}`, padding: '3px 8px', borderRadius: 200 }}>Applied</span>}
                  </div>
                  <div style={{ font: `500 12px/1.3 ${font}`, color: fg2 }}>{promo.reason}</div>
                  <div style={{ font: `500 10px/1 ${font}`, color: fg3, marginTop: 4 }}>Confidence: {promo.confidence}%</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: 16 }}>
                  <div style={{ font: `600 13px/1.2 ${font}`, color: fg1 }}>{promo.suggested}</div>
                  <div style={{ font: `500 11px/1.2 ${font}`, color: '#047538', marginTop: 2 }}>{promo.impact}</div>
                </div>
                <button
                  onClick={() => !applied && handleApply(promo.sku)}
                  disabled={applied}
                  style={{
                    padding: '7px 16px', borderRadius: 8, border: 0, cursor: applied ? 'default' : 'pointer',
                    background: applied ? '#E5F5EC' : '#4629FF',
                    color: applied ? '#047538' : '#fff',
                    font: `600 12px/1 ${font}`,
                    opacity: applied ? 0.8 : 1,
                    flexShrink: 0,
                  }}
                >
                  {applied ? 'Applied' : 'Apply'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
