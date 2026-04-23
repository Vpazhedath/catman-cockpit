'use client';

import { SAMPLE_KPIS, UAE_SKU_STATUS_COUNTS, SAMPLE_GMV_TREND, SAMPLE_ENGINE_SIGNALS } from '@/lib/sample-data';
import { useRouter } from 'next/navigation';

const STATUS_BARS = [
  { label: 'Active', count: UAE_SKU_STATUS_COUNTS.active, color: '#047538', pct: 28 },
  { label: 'On-Hold', count: UAE_SKU_STATUS_COUNTS['on-hold'], color: '#FFC400', pct: 33 },
  { label: 'Discontinued', count: UAE_SKU_STATUS_COUNTS.discontinued, color: '#D62D0B', pct: 14 },
  { label: 'Retired', count: UAE_SKU_STATUS_COUNTS.retired, color: '#93949D', pct: 27 },
];

const TOP_SKUS = [
  { rank: 1, name: 'Nestle Pure Life 1.5L', orders: 3200, growth: '+24%' },
  { rank: 2, name: 'Coca-Cola 330ml Can', orders: 2800, growth: '+12%' },
  { rank: 3, name: 'Almarai Full Cream Milk 1L', orders: 2840, growth: '+18%' },
  { rank: 4, name: 'Cadbury Dairy Milk 45g', orders: 2100, growth: '+15%' },
  { rank: 5, name: 'Lays Classic Chips 150g', orders: 1920, growth: '+8%' },
];

const RECENT_ACTIVITY = [
  { action: 'Price updated', item: 'Almarai Full Cream 1L', time: '2 min ago', type: 'price' },
  { action: 'SKU added', item: 'Oat Milk 1L', time: '15 min ago', type: 'assortment' },
  { action: 'Promo started', item: 'Flash Sale - Beverages', time: '1 hour ago', type: 'promo' },
  { action: 'Stock alert', item: 'Nestle Pure Life 1.5L', time: '2 hours ago', type: 'alert' },
];

const ENGINE_SIGNAL_COLORS: Record<string, { bg: string; fg: string }> = {
  choice: { bg: '#EDEBFF', fg: '#3A22D5' },
  affordability: { bg: '#FFF8DF', fg: '#8F5D00' },
  lifecycle: { bg: '#F7F5FC', fg: '#6635B6' },
  profitability: { bg: '#E5F5EC', fg: '#047538' },
};

const ENGINE_LABELS: Record<string, string> = {
  choice: 'Choice', affordability: 'Affordability', lifecycle: 'Lifecycle', profitability: 'Profitability',
};

const ROUTE_MAP: Record<string, string> = {
  assortment: '/assortment', price: '/price', lifecycle: '/lifecycle', profitability: '/profitability',
};

const fg1 = '#141415';
const fg2 = '#6C6D73';
const fg3 = '#93949D';
const surfLow = '#F4F5F6';
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E9EAEC', borderRadius: 12, padding: 20 };
const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';

export default function CategoryPulsePage() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Category Pulse</div>
          <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Talabat UAE · Jan 2026 · All Categories</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {SAMPLE_KPIS.map((k, i) => (
          <div key={i} style={card}>
            <div style={{ font: `600 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k.label}</div>
            <div style={{ font: `700 28px/1.2 ${font}`, color: fg1, marginTop: 8, letterSpacing: '-0.01em' }}>{k.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ font: `600 12px/1 ${font}`, color: k.direction === 'up' ? '#047538' : '#D62D0B' }}>{k.delta}</span>
              <span style={{ font: `500 11px/1 ${font}`, color: fg3 }}>{k.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SKU Status Distribution */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>SKU Status Distribution</div>
            <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginTop: 2 }}>162,736 total SKUs in Talabat UAE</div>
          </div>
          <button onClick={() => router.push('/sku-tower')} style={{ border: 0, background: 'transparent', font: `600 12px/1 ${font}`, color: '#4629FF', cursor: 'pointer' }}>View SKU Tower →</button>
        </div>
        <div style={{ display: 'flex', height: 10, borderRadius: 200, overflow: 'hidden', marginBottom: 14 }}>
          {STATUS_BARS.map((s, i) => <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {STATUS_BARS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ font: `600 14px/1.2 ${font}`, color: fg1 }}>{s.count.toLocaleString()}</div>
                <div style={{ font: `500 11px/1.2 ${font}`, color: fg2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GMV + Engine Signals */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* GMV Chart */}
        <div style={card}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>GMV Trend</div>
          <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 20 }}>UAE — Real data from BigQuery</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200 }}>
            {SAMPLE_GMV_TREND.map((d, i) => {
              const maxV = 32000000;
              const h = (d.value / maxV) * 100;
              const isLast = i === SAMPLE_GMV_TREND.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ font: `600 11px/1 ${font}`, color: fg1 }}>AED {(d.value / 1e6).toFixed(1)}M</div>
                  <div style={{ width: '100%', maxWidth: 80, height: `${h}%`, background: isLast ? '#4629FF' : '#E9EAEC', borderRadius: 6, transition: 'height 400ms ease' }} />
                  <div style={{ font: `500 11px/1 ${font}`, color: fg2 }}>{d.day}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engine Signals */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>Engine Signals</div>
            <span style={{ background: '#4629FF', color: '#fff', font: `700 10px/1 ${font}`, padding: '4px 10px', borderRadius: 200 }}>{SAMPLE_ENGINE_SIGNALS.length} active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {SAMPLE_ENGINE_SIGNALS.map((sig, i) => {
              const sc = ENGINE_SIGNAL_COLORS[sig.engine] || { bg: '#F4F5F6', fg: '#93949D' };
              return (
                <div key={i} style={{ background: sc.bg + '30', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.fg }} />
                    <span style={{ font: `600 10px/1 ${font}`, color: sc.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ENGINE_LABELS[sig.engine] || sig.engine}</span>
                  </div>
                  <div style={{ font: `500 12px/1.4 ${font}`, color: fg1, marginBottom: 6 }}>{sig.message}</div>
                  <button onClick={() => router.push(ROUTE_MAP[sig.ctaTab] || '/')} style={{ border: 0, background: 'transparent', font: `600 11px/1 ${font}`, color: '#4629FF', cursor: 'pointer', padding: 0 }}>{sig.ctaLabel}</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Top SKUs + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top SKUs */}
        <div style={card}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 14 }}>Top Performing SKUs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TOP_SKUS.map(sku => (
              <div key={sku.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: sku.rank === 1 ? '#FFF8DF' : surfLow, color: sku.rank === 1 ? '#8F5D00' : fg2, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 11px/1 ${font}`, flexShrink: 0 }}>{sku.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{sku.name}</div>
                  <div style={{ font: `500 11px/1.3 ${font}`, color: fg2 }}>{sku.orders.toLocaleString()} orders</div>
                </div>
                <span style={{ font: `600 11px/1 ${font}`, color: '#047538', background: '#E5F5EC', padding: '4px 8px', borderRadius: 200 }}>{sku.growth}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={card}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 14 }}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: a.type === 'price' ? '#F7F5FC' : a.type === 'assortment' ? '#E5F5EC' : a.type === 'promo' ? '#EDEBFF' : '#FFF8DF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, font: `600 12px/1 ${font}`, color: fg3 }}>
                  {a.type === 'price' ? '$' : a.type === 'assortment' ? '+' : a.type === 'promo' ? '%' : '!'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: `500 13px/1.3 ${font}`, color: fg1 }}><strong>{a.action}</strong> · {a.item}</div>
                  <div style={{ font: `500 11px/1.3 ${font}`, color: fg3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
