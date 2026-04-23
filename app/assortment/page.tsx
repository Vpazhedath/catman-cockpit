'use client';

import { useState, useMemo } from 'react';
import { SAMPLE_ASSORTMENT_RECS } from '@/lib/sample-data';

const SEGMENTS = [
  { key: 'missing', label: 'Missing SKUs', count: 23 },
  { key: 'underperforming', label: 'Underperforming', count: 8 },
  { key: 'oos-risk', label: 'OOS Risk', count: 5 },
];

const ADDITIONAL_RECS = [
  { source: 'competitor' as const, skuName: 'Alpro Unsweetened Oat 1L', rationale: 'Available on Carrefour at AED 16.5. High search volume in plant-based category. Est. 400+ units/month.', confidence: 88 },
  { source: 'search' as const, skuName: 'Premium Greek Yogurt 500g', rationale: 'Search volume up 180% MoM. Zero organic listings. Price potential AED 22-28.', confidence: 75 },
  { source: 'nielsen' as const, skuName: 'Nestle A+ Milk 1L', rationale: 'Top 5 nationally by value in MT. Gap in availability on platform. Margin est. 25-30%.', confidence: 82 },
];

const sourceStyle: Record<string, { bg: string; fg: string; label: string }> = {
  competitor: { bg: '#EDEBFF', fg: '#4629FF', label: 'Competitor' },
  search: { bg: '#FFF8DF', fg: '#8F5D00', label: 'Search' },
  nielsen: { bg: '#E5F5EC', fg: '#047538', label: 'Nielsen' },
};

const fg1 = '#141415';
const fg2 = '#6C6D73';
const fg3 = '#93949D';
const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E9EAEC', borderRadius: 12 };

export default function AssortmentPage() {
  const [activeSegment, setActiveSegment] = useState('missing');
  const [acceptedSKUs, setAcceptedSKUs] = useState<string[]>([]);

  const allRecommendations = useMemo(() => [...SAMPLE_ASSORTMENT_RECS, ...ADDITIONAL_RECS], []);

  const handleAdd = (skuName: string) => {
    setAcceptedSKUs(prev => [...prev, skuName]);
  };

  const summaryCards = [
    { label: 'Missing vs Competitors', value: '23', color: fg1, sub: 'Carrefour, Lulu, Noon' },
    { label: 'High Search Demand', value: '12', color: '#4629FF', sub: 'Unmet search volume' },
    { label: 'Est. Monthly Revenue', value: 'AED 48K', color: '#047538', sub: 'If all recommendations added' },
    { label: 'Avg Confidence', value: '84%', color: fg1, sub: 'Across all recommendations' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Choice</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Choice Engine · {allRecommendations.length} opportunities identified</div>
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

      {/* Segment Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {SEGMENTS.map(seg => {
          const active = activeSegment === seg.key;
          return (
            <button key={seg.key} onClick={() => setActiveSegment(seg.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 200, cursor: 'pointer',
              border: `1px solid ${active ? '#4629FF' : '#E9EAEC'}`,
              background: active ? '#EDEBFF' : 'transparent',
              color: active ? '#4629FF' : fg2,
              font: `600 12px/1 ${font}`,
            }}>
              {seg.label}
              <span style={{ font: `500 10px/1 ${mono}`, opacity: 0.7 }}>{seg.count}</span>
            </button>
          );
        })}
      </div>

      {/* Recommendation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {allRecommendations.map((rec, i) => {
          const accepted = acceptedSKUs.includes(rec.skuName);
          const src = sourceStyle[rec.source] || sourceStyle.competitor;
          return (
            <div key={i} style={{ ...card, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, border: accepted ? '1px solid #047538' : '1px solid #E9EAEC' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ background: src.bg, color: src.fg, font: `600 10px/1 ${font}`, padding: '4px 10px', borderRadius: 200, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{src.label}</span>
                {accepted && <span style={{ background: '#E5F5EC', color: '#047538', font: `600 10px/1 ${font}`, padding: '4px 10px', borderRadius: 200 }}>Added</span>}
              </div>
              <div style={{ font: `700 15px/1.3 ${font}`, color: fg1 }}>{rec.skuName}</div>
              <div style={{ font: `500 12px/1.5 ${font}`, color: fg2, flex: 1 }}>{rec.rationale}</div>
              {/* Confidence bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ font: `500 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Confidence</span>
                  <span style={{ font: `600 11px/1 ${mono}`, color: fg1 }}>{rec.confidence}%</span>
                </div>
                <div style={{ height: 4, background: '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${rec.confidence}%`, background: rec.confidence >= 85 ? '#047538' : rec.confidence >= 75 ? '#4629FF' : '#8F5D00', borderRadius: 200, transition: 'width 300ms ease' }} />
                </div>
              </div>
              <button
                onClick={() => !accepted && handleAdd(rec.skuName)}
                disabled={accepted}
                style={{
                  padding: '8px 16px', borderRadius: 8, cursor: accepted ? 'default' : 'pointer',
                  border: 0, font: `600 12px/1 ${font}`,
                  background: accepted ? '#E5F5EC' : '#4629FF',
                  color: accepted ? '#047538' : '#fff',
                  opacity: accepted ? 0.8 : 1,
                  transition: 'background 150ms ease',
                }}
              >
                {accepted ? '✓ Added to assortment' : 'Add to assortment'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recently Accepted */}
      {acceptedSKUs.length > 0 && (
        <div style={{ ...card, padding: 20 }}>
          <div style={{ font: `700 14px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Recently Accepted</div>
          <div style={{ font: `500 12px/1.3 ${font}`, color: fg2, marginBottom: 12 }}>{acceptedSKUs.length} SKUs added to pipeline</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {acceptedSKUs.map(sku => (
              <span key={sku} style={{ background: '#E5F5EC', color: '#047538', font: `600 11px/1 ${font}`, padding: '6px 12px', borderRadius: 200, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                {sku}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
