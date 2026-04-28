'use client';

import { SAMPLE_SKUS } from '@/lib/sample-data';
import { useTheme } from '@/lib/ThemeContext';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

const stages = [
  { stage: 'New', key: 'new' as const, color: '#4629FF', desc: 'Recently listed, monitoring velocity' },
  { stage: 'Probation', key: 'probation' as const, color: '#6635B6', desc: 'Under performance evaluation' },
  { stage: 'Mature', key: 'mature' as const, color: '#047538', desc: 'Stable performers, fully distributed' },
  { stage: 'Review', key: 'review' as const, color: '#FFC400', desc: 'Underperforming, may be phased out' },
  { stage: 'Phase-out', key: 'phase-out' as const, color: '#D62D0B', desc: 'Being removed, clearance pricing' },
];

const transitions = [
  { sku: 'Almarai Greek Yogurt 400g', from: 'New', to: 'Probation', time: '2 days ago', auto: true },
  { sku: 'Head & Shoulders 400ml', from: 'Mature', to: 'Review', time: '5 days ago', auto: true },
  { sku: 'Local Brand Chips 100g', from: 'Review', to: 'Phase-out', time: '1 week ago', auto: true },
  { sku: 'Organic Almond Milk 1L', from: 'Probation', to: 'Review', time: '1 week ago', auto: false },
];

export default function LifecyclePage() {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const card: React.CSSProperties = { background: t ? '#1E1E20' : '#fff', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 12, padding: 20 };

  const stageCounts = stages.map(s => ({
    ...s,
    count: SAMPLE_SKUS.filter(sku => sku.maturityStage === s.key).length || (s.key === 'new' ? 2 : 0),
  }));
  const total = stageCounts.reduce((a, s) => a + s.count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Lifecycle</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>SKU Lifecycle Engine · Fully automated stage management</div>
      </div>

      {/* Funnel */}
      <div style={card}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 20 }}>SKU Stage Funnel</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
          {stageCounts.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ background: `${s.color}18`, borderRadius: 10, padding: '20px 12px', marginBottom: 10, position: 'relative' }}>
                <div style={{ font: `700 28px/1 ${font}`, color: s.color }}>{s.count}</div>
                <div style={{ font: `600 12px/1 ${font}`, color: fg1, marginTop: 6 }}>{s.stage}</div>
                <div style={{ font: `500 10px/1.4 ${font}`, color: fg3, marginTop: 4 }}>{s.desc}</div>
                {i < stageCounts.length - 1 && <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)', color: fg3 }}>→</div>}
              </div>
              <div style={{ height: 4, background: s.color, borderRadius: 200, width: `${(s.count / total) * 100 + 20}%`, margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent transitions */}
      <div style={card}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 16 }}>Recent Stage Transitions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {transitions.map((tr, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', borderRadius: 8, borderBottom: `1px solid ${t ? '#343437' : '#F4F5F6'}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t ? '#343437' : '#F4F5F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={fg3} strokeWidth="1.75" style={{ opacity: 0.6 }}>
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{tr.sku}</div>
                <div style={{ font: `500 11px/1.3 ${font}`, color: fg2 }}>{tr.from} → {tr.to} · {tr.time}</div>
              </div>
              <span style={{ background: tr.auto ? (t ? '#343437' : '#F4F5F6') : (t ? 'rgba(70,41,255,0.1)' : '#EDEBFF'), color: tr.auto ? fg3 : '#4629FF', font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200 }}>{tr.auto ? 'Automated' : 'Manual'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
