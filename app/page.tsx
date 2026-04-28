'use client';

import { useState, useEffect } from 'react';
import { SAMPLE_KPIS, UAE_SKU_STATUS_COUNTS, SAMPLE_GMV_TREND, SAMPLE_ENGINE_SIGNALS } from '@/lib/sample-data';
import { useApi, KPI, GMVTrendPoint, SKUStatusCounts, EngineSignal } from '@/lib/useApi';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';
import { GMVTrendChart, ChartVariant } from '@/components/Charts';

const TOP_SKUS = [
  { rank: 1, name: 'Nestle Pure Life 1.5L', orders: 3200, growth: '+24%' },
  { rank: 2, name: 'Coca-Cola 330ml Can', orders: 2800, growth: '+12%' },
  { rank: 3, name: 'Almarai Full Cream Milk 1L', orders: 2840, growth: '+18%' },
  { rank: 4, name: 'Cadbury Dairy Milk 45g', orders: 2100, growth: '+15%' },
  { rank: 5, name: 'Lays Classic Chips 150g', orders: 1920, growth: '+8%' },
];

const RECENT_ACTIVITY = [
  { action: 'Price updated', item: 'Almarai Full Cream 1L', time: '2 min ago', type: 'price' as const },
  { action: 'SKU added', item: 'Oat Milk 1L', time: '15 min ago', type: 'assortment' as const },
  { action: 'Promo started', item: 'Flash Sale - Beverages', time: '1 hour ago', type: 'promo' as const },
  { action: 'Stock alert', item: 'Nestle Pure Life 1.5L', time: '2 hours ago', type: 'alert' as const },
];

const ENGINE_SIGNAL_COLORS: Record<string, { bg: string; fg: string }> = {
  choice: { bg: '#EDEBFF', fg: '#3A22D5' },
  affordability: { bg: '#FFF8DF', fg: '#8F5D00' },
  lifecycle: { bg: '#F7F5FC', fg: '#6635B6' },
  profitability: { bg: '#E5F5EC', fg: '#047538' },
};
const ENGINE_LABELS: Record<string, string> = { choice: 'Choice', affordability: 'Affordability', lifecycle: 'Lifecycle', profitability: 'Profitability' };
const ROUTE_MAP: Record<string, string> = { choice: '/assortment', affordability: '/price', lifecycle: '/lifecycle', profitability: '/profitability' };
const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const typeColors: Record<string, string> = { price: '#F7F5FC', assortment: '#E5F5EC', promo: '#EDEBFF', alert: '#FFF8DF' };
const typeIcons: Record<string, string> = { price: '$', assortment: '+', promo: '%', alert: '!' };

// Loading skeleton component
function SkeletonCard() {
  return (
    <div style={{ background: '#f4f5f6', borderRadius: 12, padding: 20, minHeight: 120 }}>
      <div style={{ width: '40%', height: 12, background: '#e9eaec', borderRadius: 4, marginBottom: 12 }} />
      <div style={{ width: '60%', height: 28, background: '#e9eaec', borderRadius: 4, marginBottom: 8 }} />
      <div style={{ width: '30%', height: 12, background: '#e9eaec', borderRadius: 4 }} />
    </div>
  );
}

export default function CategoryPulsePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const t = theme === 'dark';
  const [chartVariant, setChartVariant] = useState<ChartVariant>('bar');
  const card: React.CSSProperties = { background: t ? '#1E1E20' : '#fff', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 12, padding: 20 };
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfLow = t ? '#343437' : '#F4F5F6';

  // Fetch data from API routes
  const { data: kpis, loading: kpisLoading } = useApi<KPI[]>('/api/kpis', { initialData: SAMPLE_KPIS });
  const { data: skuStatus, loading: statusLoading } = useApi<SKUStatusCounts>('/api/sku-status', { initialData: UAE_SKU_STATUS_COUNTS });
  const { data: gmvTrend, loading: gmvLoading } = useApi<GMVTrendPoint[]>('/api/gmv-trend', { initialData: SAMPLE_GMV_TREND });
  const { data: engineSignals, loading: signalsLoading } = useApi<EngineSignal[]>('/api/engine-signals', { initialData: SAMPLE_ENGINE_SIGNALS });

  // Calculate status bars from live data
  const statusBars = skuStatus ? [
    { label: 'Active', count: skuStatus.active, color: '#047538', pct: Math.round(skuStatus.active / (skuStatus.active + skuStatus['on-hold'] + skuStatus.discontinued + skuStatus.retired) * 100) },
    { label: 'On-Hold', count: skuStatus['on-hold'], color: '#FFC400', pct: Math.round(skuStatus['on-hold'] / (skuStatus.active + skuStatus['on-hold'] + skuStatus.discontinued + skuStatus.retired) * 100) },
    { label: 'Discontinued', count: skuStatus.discontinued, color: '#D62D0B', pct: Math.round(skuStatus.discontinued / (skuStatus.active + skuStatus['on-hold'] + skuStatus.discontinued + skuStatus.retired) * 100) },
    { label: 'Retired', count: skuStatus.retired, color: '#93949D', pct: Math.round(skuStatus.retired / (skuStatus.active + skuStatus['on-hold'] + skuStatus.discontinued + skuStatus.retired) * 100) },
  ] : [];

  const totalSkus = skuStatus ? (skuStatus.active + skuStatus['on-hold'] + skuStatus.discontinued + skuStatus.retired).toLocaleString() : '0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Category Pulse</div>
          <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Talabat UAE · Jan 2026 · All Categories</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['Export', 'Jan 2026'].map(label => (
            <button key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t ? '#1E1E20' : '#fff', color: t ? '#b9bac1' : '#141415', border: `1px solid ${t ? '#343437' : '#CECED4'}`, font: `600 12px/1 ${font}`, padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpisLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (kpis || SAMPLE_KPIS).map((k, i) => (
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
            <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginTop: 2 }}>{totalSkus} total SKUs in Talabat UAE</div>
          </div>
          <button onClick={() => router.push('/sku-tower')} style={{ border: 0, background: 'transparent', font: `600 12px/1 ${font}`, color: '#4629FF', cursor: 'pointer' }}>View SKU Tower →</button>
        </div>
        <div style={{ display: 'flex', height: 10, borderRadius: 200, overflow: 'hidden', marginBottom: 14 }}>
          {statusBars.map((s, i) => <div key={i} style={{ width: `${s.pct}%`, background: s.color }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {statusBars.map((s, i) => (
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

      {/* GMV Trend & Engine Signals */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>GMV Trend</div>
              <div style={{ font: `500 12px/1.4 ${font}`, color: fg2 }}>UAE — {gmvLoading ? 'Loading...' : 'Live data from BigQuery'}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['bar', 'area', 'line'] as ChartVariant[]).map(v => (
                <button
                  key={v}
                  onClick={() => setChartVariant(v)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: 'none',
                    font: `600 11px/1 ${font}`,
                    cursor: 'pointer',
                    background: chartVariant === v ? '#4629FF' : (t ? '#343437' : '#F4F5F6'),
                    color: chartVariant === v ? '#fff' : fg2,
                    textTransform: 'capitalize',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <GMVTrendChart data={gmvTrend || SAMPLE_GMV_TREND} height={200} variant={chartVariant} />
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>Engine Signals</div>
            <span style={{ background: '#4629FF', color: '#fff', font: `700 10px/1 ${font}`, padding: '4px 10px', borderRadius: 200 }}>{(engineSignals || SAMPLE_ENGINE_SIGNALS).length} active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(engineSignals || SAMPLE_ENGINE_SIGNALS).map((sig, i) => {
              const sc = ENGINE_SIGNAL_COLORS[sig.engine] || { bg: '#F4F5F6', fg: '#93949D' };
              return (
                <div key={i} style={{ background: t ? 'rgba(70,41,255,0.08)' : sc.bg, borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.fg }} />
                    <span style={{ font: `600 10px/1 ${font}`, color: sc.fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{ENGINE_LABELS[sig.engine]}</span>
                  </div>
                  <div style={{ font: `500 12px/1.4 ${font}`, color: fg1, marginBottom: 6 }}>{sig.message}</div>
                  <button onClick={() => router.push(ROUTE_MAP[sig.ctaTab] || '/')} style={{ border: 0, background: 'transparent', font: `600 11px/1 ${font}`, color: '#4629FF', cursor: 'pointer', padding: 0 }}>{sig.ctaLabel}</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top SKUs & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={card}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 14 }}>Top Performing SKUs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TOP_SKUS.map(sku => (
              <div key={sku.rank} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8, cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: sku.rank === 1 ? '#FFF8DF' : surfLow, color: sku.rank === 1 ? '#8F5D00' : fg2, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 11px/1 ${font}`, flexShrink: 0 }}>{sku.rank}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{sku.name}</div>
                  <div style={{ font: `500 11px/1.3 ${font}`, color: fg2 }}>{sku.orders.toLocaleString()} orders</div>
                </div>
                <span style={{ font: `600 11px/1 ${font}`, color: '#047538', background: t ? 'rgba(4,117,56,0.12)' : '#E5F5EC', padding: '4px 8px', borderRadius: 200 }}>{sku.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 14 }}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: t ? 'rgba(70,41,255,0.08)' : typeColors[a.type], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, font: `600 12px/1 ${font}`, color: fg3 }}>{typeIcons[a.type]}</div>
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