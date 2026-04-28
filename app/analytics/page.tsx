'use client';

import { useTheme } from '@/lib/ThemeContext';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

const PERFORMANCE_METRICS = [
  { metric: 'GMV', current: 'AED 2.4M', previous: 'AED 2.1M', change: '+14%', trend: 'up' },
  { metric: 'Orders', current: '18,420', previous: '16,890', change: '+9%', trend: 'up' },
  { metric: 'Avg Basket', current: 'AED 130', previous: 'AED 125', change: '+4%', trend: 'up' },
  { metric: 'SKU Count', current: '205', previous: '198', change: '+4%', trend: 'up' },
];

const ENGINE_PERFORMANCE = [
  { engine: 'Choice Engine', recommendations: 23, accepted: 18, acceptanceRate: '78%', avgConfidence: '85%' },
  { engine: 'Lifecycle Engine', recommendations: 8, accepted: 6, acceptanceRate: '75%', avgConfidence: '92%' },
  { engine: 'Affordability Engine', recommendations: 14, accepted: 10, acceptanceRate: '71%', avgConfidence: '88%' },
  { engine: 'Profitability Engine', recommendations: 3, accepted: 2, acceptanceRate: '67%', avgConfidence: '82%' },
];

const TOP_CATEGORIES = [
  { category: 'Dairy', skus: 45, revenue: 'AED 420K', growth: '+12%' },
  { category: 'Beverages', skus: 38, revenue: 'AED 380K', growth: '+8%' },
  { category: 'Water', skus: 22, revenue: 'AED 180K', growth: '+15%' },
  { category: 'Energy Drinks', skus: 15, revenue: 'AED 145K', growth: '+22%' },
  { category: 'Juices', skus: 28, revenue: 'AED 120K', growth: '-3%' },
];

const RECENT_ACTIONS = [
  { action: 'SKU Discontinued', item: 'Almarai Laban 200ml', user: 'System', time: '10 min ago', color: '#D62D0B' },
  { action: 'Price Matched', item: 'Lacnor Orange Juice 1L', user: 'Ahmed K.', time: '25 min ago', color: '#4629FF' },
  { action: 'Clearance Started', item: 'Premium Yogurt 500g', user: 'Sara M.', time: '1 hour ago', color: '#8F5D00' },
  { action: 'SKU Added', item: 'Oat Milk 1L', user: 'Mohammed R.', time: '2 hours ago', color: '#047538' },
  { action: 'Status Changed', item: 'Nestle Pure Life 1.5L', user: 'System', time: '3 hours ago', color: '#4629FF' },
];

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const t = theme === 'dark';

  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfPrimary = t ? '#1E1E20' : '#fff';
  const surfSecondary = t ? '#343437' : '#F4F5F6';
  const border = t ? '#343437' : '#E9EAEC';

  const cardStyle: React.CSSProperties = {
    background: surfPrimary,
    border: `1px solid ${border}`,
    borderRadius: 12,
    padding: 20,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Analytics Dashboard</div>
          <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Performance insights and engine metrics</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: t ? '#1E1E20' : '#fff', color: fg1, border: `1px solid ${border}`, borderRadius: 8, padding: '10px 16px', font: `600 13px/1 ${font}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Export Report
          </button>
          <button style={{ background: '#4629FF', color: '#fff', border: 0, borderRadius: 8, padding: '10px 20px', font: `600 13px/1 ${font}`, cursor: 'pointer' }}>Share</button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {PERFORMANCE_METRICS.map((m) => (
          <div key={m.metric} style={cardStyle}>
            <div style={{ font: `500 12px/1 ${font}`, color: fg2 }}>{m.metric}</div>
            <div style={{ font: `700 24px/1.2 ${font}`, color: fg1, marginTop: 6 }}>{m.current}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ font: `600 12px/1 ${font}`, color: m.trend === 'up' ? '#047538' : '#D62D0B' }}>{m.change}</span>
              <span style={{ font: `500 11px/1 ${font}`, color: fg3 }}>vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Engine Performance */}
        <div style={cardStyle}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Engine Performance</div>
          <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 16 }}>Recommendation acceptance rates</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: surfSecondary }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Engine</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recommendations</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Accepted</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Acceptance</th>
                <th style={{ textAlign: 'center', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {ENGINE_PERFORMANCE.map((engine) => (
                <tr key={engine.engine} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: '12px 14px', font: `600 13px/1 ${font}`, color: fg1 }}>{engine.engine}</td>
                  <td style={{ padding: '12px 14px', font: `500 13px/1 ${font}`, color: fg2, textAlign: 'center' }}>{engine.recommendations}</td>
                  <td style={{ padding: '12px 14px', font: `500 13px/1 ${font}`, color: fg2, textAlign: 'center' }}>{engine.accepted}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ background: parseInt(engine.acceptanceRate) >= 70 ? '#E5F5EC' : '#FFF8DF', color: parseInt(engine.acceptanceRate) >= 70 ? '#047538' : '#8F5D00', font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200 }}>{engine.acceptanceRate}</span>
                  </td>
                  <td style={{ padding: '12px 14px', font: `600 13px/1 ${font}`, color: '#4629FF', textAlign: 'center' }}>{engine.avgConfidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Categories */}
        <div style={cardStyle}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Top Categories</div>
          <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 12 }}>By revenue this period</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TOP_CATEGORIES.map((cat, idx) => (
              <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: idx === 0 ? '#FFF8DF' : surfSecondary, color: idx === 0 ? '#8F5D00' : fg2, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `700 11px/1 ${font}`, flexShrink: 0 }}>{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{cat.category}</div>
                  <div style={{ font: `500 11px/1.3 ${font}`, color: fg3 }}>{cat.skus} SKUs</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: `600 13px/1 ${font}`, color: fg1 }}>{cat.revenue}</div>
                  <div style={{ font: `500 11px/1 ${font}`, color: cat.growth.startsWith('+') ? '#047538' : '#D62D0B' }}>{cat.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      <div style={cardStyle}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Recent Actions</div>
        <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 12 }}>Latest system and user activities</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {RECENT_ACTIONS.map((a, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t ? `${a.color}18` : `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2">
                  {a.action.includes('Discontinued') ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /> : a.action.includes('Added') ? <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />}
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `500 13px/1.3 ${font}`, color: fg1 }}><strong>{a.action}</strong> · {a.item}</div>
                <div style={{ font: `500 11px/1.3 ${font}`, color: fg3 }}>{a.user} · {a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}