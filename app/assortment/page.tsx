'use client';

import { useState } from 'react';
import { SAMPLE_ASSORTMENT_RECS } from '@/lib/sample-data';
import { useTheme } from '@/lib/ThemeContext';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

const segments = [
  { key: 'missing', label: 'Missing SKUs', count: 23 },
  { key: 'underperforming', label: 'Underperforming', count: 8 },
  { key: 'oos-risk', label: 'OOS Risk', count: 5 },
];

const sourceStyle: Record<string, { bg: string; fg: string; label: string }> = {
  competitor: { bg: '#EDEBFF', fg: '#3A22D5', label: 'Competitor signal' },
  search: { bg: '#F7F5FC', fg: '#6635B6', label: 'Search trend' },
  nielsen: { bg: '#FFF8DF', fg: '#8F5D00', label: 'Nielsen data' },
};

export default function AssortmentPage() {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const [segment, setSegment] = useState('missing');
  const [accepted, setAccepted] = useState<string[]>([]);

  const card: React.CSSProperties = { background: t ? '#1E1E20' : '#fff', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 12, padding: 20 };
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';

  const handleAdd = (name: string) => setAccepted(prev => [...prev, name]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Choice</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Choice Engine · {SAMPLE_ASSORTMENT_RECS.length} opportunities identified</div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Missing vs Competitors', v: '23', sub: 'Carrefour, Lulu, Noon', c: fg1 },
          { l: 'High Search Demand', v: '12', sub: 'Unmet search volume', c: '#4629FF' },
          { l: 'Est. Monthly Revenue', v: 'AED 48K', sub: 'If all recommendations added', c: '#047538' },
          { l: 'Avg Confidence', v: '84%', sub: 'Across all recommendations', c: fg1 },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.c, marginTop: 6 }}>{s.v}</div>
            <div style={{ font: `500 11px/1 ${font}`, color: fg3, marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Segment switcher */}
      <div style={{ display: 'flex', gap: 6 }}>
        {segments.map(seg => (
          <button key={seg.key} onClick={() => setSegment(seg.key)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 200, cursor: 'pointer', font: `600 12px/1 ${font}`,
            background: segment === seg.key ? '#4629FF' : 'transparent',
            color: segment === seg.key ? '#fff' : fg2,
            border: `1px solid ${segment === seg.key ? '#4629FF' : (t ? '#343437' : '#E9EAEC')}`,
          }}>
            {seg.label}
            <span style={{ font: `500 10px/1 ${font}`, opacity: segment === seg.key ? 0.8 : 0.6 }}>{seg.count}</span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {SAMPLE_ASSORTMENT_RECS.map((rec, i) => {
          const ss = sourceStyle[rec.source] || sourceStyle.competitor;
          const isAccepted = accepted.includes(rec.skuName);
          return (
            <div key={i} style={{ ...card, ...(isAccepted ? { border: '2px solid #047538', background: t ? 'rgba(4,117,56,0.06)' : 'rgba(4,117,56,0.02)' } : {}) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ background: t ? `${ss.fg}18` : ss.bg, color: ss.fg, font: `600 10px/1 ${font}`, padding: '4px 10px', borderRadius: 200 }}>{ss.label}</span>
                {isAccepted && <span style={{ font: `600 11px/1 ${font}`, color: '#047538', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" /></svg> Added
                </span>}
              </div>
              <div style={{ font: `700 16px/1.3 ${font}`, color: fg1, marginBottom: 8 }}>{rec.skuName}</div>
              <div style={{ font: `500 12px/1.5 ${font}`, color: fg2, marginBottom: 14 }}>{rec.rationale}</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ font: `500 11px/1 ${font}`, color: fg3 }}>Confidence</span>
                  <span style={{ font: `600 11px/1 ${font}`, color: fg1 }}>{rec.confidence}%</span>
                </div>
                <div style={{ height: 5, background: t ? '#343437' : '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                  <div style={{ width: `${rec.confidence}%`, height: '100%', background: isAccepted ? '#047538' : '#4629FF', borderRadius: 200, transition: 'width 400ms ease' }} />
                </div>
              </div>
              <button onClick={() => !isAccepted && handleAdd(rec.skuName)} disabled={isAccepted} style={{
                width: '100%', padding: '10px 16px', borderRadius: 8, font: `600 13px/1 ${font}`, cursor: isAccepted ? 'default' : 'pointer', border: 0,
                background: isAccepted ? (t ? '#343437' : '#E9EAEC') : '#4629FF',
                color: isAccepted ? fg3 : '#fff',
              }}>{isAccepted ? 'Added to pipeline' : 'Add to assortment'}</button>
            </div>
          );
        })}
      </div>

      {/* Accepted */}
      {accepted.length > 0 && (
        <div style={card}>
          <div style={{ font: `700 14px/1.3 ${font}`, color: fg1, marginBottom: 10 }}>Recently Accepted ({accepted.length})</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {accepted.map(a => <span key={a} style={{ background: t ? 'rgba(4,117,56,0.12)' : '#E5F5EC', color: '#047538', font: `600 11px/1 ${font}`, padding: '5px 10px', borderRadius: 200, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg> {a}
            </span>)}
          </div>
        </div>
      )}
    </div>
  );
}
