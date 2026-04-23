'use client';

import { useMemo, useState } from 'react';
import {
  SKULifecycleEngine,
  SAMPLE_LIFECYCLE_SKUS,
  type SKUMaturityStage,
  type SKUEfficiency,
  LIFECYCLE_THRESHOLDS,
} from '@/lib/lifecycle-engine';

const stageColors: Record<SKUMaturityStage, { bg: string; fg: string }> = {
  new: { bg: '#EDEBFF', fg: '#4629FF' },
  probation: { bg: '#F7F5FC', fg: '#6635B6' },
  mature: { bg: '#E5F5EC', fg: '#047538' },
  review: { bg: '#FFF8DF', fg: '#8F5D00' },
  'phase-out': { bg: '#FCEBE8', fg: '#BF280A' },
};
const stageLabels: Record<SKUMaturityStage, string> = {
  new: 'New', probation: 'Probation', mature: 'Mature', review: 'Review', 'phase-out': 'Phase-out',
};
const stageSubs: Record<SKUMaturityStage, string> = {
  new: '0–30 days', probation: '31–90 days', mature: '>90 days', review: 'Action needed', 'phase-out': 'Discontinued',
};

const effLabels: Record<SKUEfficiency, string> = {
  efficient: 'Efficient (>1 unit/wk)', 'slow-mover': 'Slow Mover (<1 unit/wk)', 'zero-mover': 'Zero Mover (0 units)', 'low-availability': 'Low Availability (<80%)',
};
const effColors: Record<SKUEfficiency, { bar: string; text: string }> = {
  efficient: { bar: '#047538', text: '#047538' },
  'slow-mover': { bar: '#FFC400', text: '#8F5D00' },
  'zero-mover': { bar: '#D62D0B', text: '#D62D0B' },
  'low-availability': { bar: '#E07000', text: '#E07000' },
};

const fg1 = '#141415';
const fg2 = '#6C6D73';
const fg3 = '#93949D';
const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';
const card: React.CSSProperties = { background: '#fff', border: '1px solid #E9EAEC', borderRadius: 12 };

export default function LifecyclePage() {
  const [selectedStage, setSelectedStage] = useState<SKUMaturityStage | 'all'>('all');
  const [selectedEfficiency, setSelectedEfficiency] = useState<SKUEfficiency | 'all'>('all');

  const processedSKUs = useMemo(() => SKULifecycleEngine.processSKUBatch(SAMPLE_LIFECYCLE_SKUS), []);

  const stageCounts = useMemo(() => {
    const c: Record<SKUMaturityStage, number> = { new: 0, probation: 0, mature: 0, review: 0, 'phase-out': 0 };
    processedSKUs.forEach(s => { c[s.maturityStage]++; });
    return c;
  }, [processedSKUs]);

  const effCounts = useMemo(() => {
    const c: Record<SKUEfficiency, number> = { efficient: 0, 'slow-mover': 0, 'zero-mover': 0, 'low-availability': 0 };
    processedSKUs.forEach(s => { c[s.efficiency]++; });
    return c;
  }, [processedSKUs]);

  const recommendationCount = processedSKUs.filter(s => s.recommendedAction).length;
  const totalSKUs = processedSKUs.length;

  const filteredSKUs = useMemo(() => {
    return processedSKUs.filter(s => {
      if (selectedStage !== 'all' && s.maturityStage !== selectedStage) return false;
      if (selectedEfficiency !== 'all' && s.efficiency !== selectedEfficiency) return false;
      return true;
    });
  }, [processedSKUs, selectedStage, selectedEfficiency]);

  const summaryCards = [
    { label: 'Total SKUs', value: String(totalSKUs), color: fg1, sub: 'Across all lifecycle stages' },
    { label: 'New SKUs (≤30 days)', value: String(stageCounts.new), color: '#4629FF', sub: 'In launch period' },
    { label: 'Non-performing', value: String(effCounts['zero-mover'] + effCounts['slow-mover']), color: '#D62D0B', sub: 'Zero/Slow movers' },
    { label: 'Actions Required', value: String(recommendationCount), color: '#8F5D00', sub: 'Recommendations pending' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Lifecycle</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Lifecycle Engine · SKU maturity tracking & efficiency monitoring</div>
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

      {/* Lifecycle Funnel */}
      <div style={{ ...card, padding: 20 }}>
        <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>SKU Lifecycle Funnel</div>
        <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 20 }}>{totalSKUs} SKUs across maturity stages</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, paddingBottom: 8 }}>
          {(['new', 'probation', 'mature', 'review', 'phase-out'] as SKUMaturityStage[]).map((stage, idx) => {
            const count = stageCounts[stage];
            const sc = stageColors[stage];
            const widths = [200, 175, 240, 155, 130];
            const active = selectedStage === stage;
            return (
              <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setSelectedStage(selectedStage === stage ? 'all' : stage)}>
                <div style={{
                  width: widths[idx], height: 52, borderRadius: 10,
                  background: sc.bg, border: active ? `2px solid ${sc.fg}` : '2px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  font: `700 14px/1 ${font}`, color: sc.fg,
                  transition: 'border 150ms ease, transform 150ms ease',
                  transform: active ? 'scale(1.04)' : 'scale(1)',
                }}>
                  {count} SKUs
                </div>
                <div style={{ font: `600 12px/1.3 ${font}`, color: fg1, marginTop: 8 }}>{stageLabels[stage]}</div>
                <div style={{ font: `500 10px/1.3 ${font}`, color: fg3, marginTop: 2 }}>{stageSubs[stage]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Efficiency + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Efficiency Distribution */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Efficiency Distribution</div>
          <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 16 }}>By sales velocity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(['efficient', 'slow-mover', 'zero-mover', 'low-availability'] as SKUEfficiency[]).map(eff => {
              const count = effCounts[eff];
              const pct = totalSKUs > 0 ? (count / totalSKUs) * 100 : 0;
              const ec = effColors[eff];
              const active = selectedEfficiency === eff;
              return (
                <div key={eff} style={{ cursor: 'pointer', padding: '8px 10px', borderRadius: 8, background: active ? '#F4F5F6' : 'transparent', transition: 'background 150ms ease' }}
                  onClick={() => setSelectedEfficiency(selectedEfficiency === eff ? 'all' : eff)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ font: `600 12px/1.3 ${font}`, color: ec.text }}>{effLabels[eff]}</span>
                    <span style={{ font: `500 11px/1 ${font}`, color: fg2 }}>{count} SKUs ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ height: 6, background: '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: ec.bar, borderRadius: 200, transition: 'width 300ms ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Recommendations */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 4 }}>Active Recommendations</div>
          <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 16 }}>{recommendationCount} actions pending</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {processedSKUs.filter(s => s.recommendedAction).slice(0, 5).map(sku => {
              const pr = sku.recommendedAction!;
              const prStyle = pr.priority === 'high' ? { bg: '#FCEBE8', fg: '#BF280A' } : pr.priority === 'medium' ? { bg: '#FFF8DF', fg: '#8F5D00' } : { bg: '#F4F5F6', fg: fg3 };
              return (
                <div key={sku.skuId} style={{ border: '1px solid #E9EAEC', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{sku.name}</div>
                      <div style={{ font: `500 11px/1.3 ${font}`, color: fg3, marginTop: 2 }}>{sku.category} · {sku.supplier}</div>
                    </div>
                    <span style={{ background: prStyle.bg, color: prStyle.fg, font: `600 9px/1 ${font}`, padding: '3px 8px', borderRadius: 200, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{pr.priority}</span>
                  </div>
                  <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginBottom: 8 }}>{pr.reason}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ font: `500 10px/1 ${font}`, color: fg3 }}>Impact: {pr.estimatedImpact}</span>
                    <button style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #E9EAEC', background: '#fff', color: '#4629FF', font: `600 11px/1 ${font}`, cursor: 'pointer' }}>Take Action</button>
                  </div>
                </div>
              );
            })}
            {recommendationCount === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ font: `500 13px/1.4 ${font}`, color: fg3 }}>No recommendations at this time</div>
                <div style={{ font: `500 11px/1.4 ${font}`, color: fg3, marginTop: 4 }}>All SKUs are performing well</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SKU Lifecycle Table */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9EAEC' }}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>SKU Lifecycle Details</div>
          <div style={{ font: `500 12px/1.4 ${font}`, color: fg2, marginTop: 2 }}>All SKUs with lifecycle metrics</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F5F6' }}>
              {['SKU', 'Stage', 'Efficiency', 'Days', 'Units/Wk', 'Avail%', 'DOH', 'Shrink%', 'Action'].map(h => (
                <th key={h} style={{ textAlign: h === 'SKU' ? 'left' : h === 'Stage' || h === 'Efficiency' || h === 'Action' ? 'center' : 'right', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSKUs.map(sku => {
              const sc = stageColors[sku.maturityStage];
              const ec = effColors[sku.efficiency];
              return (
                <tr key={sku.skuId} style={{ borderBottom: '1px solid #F4F5F6' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ font: `600 13px/1.3 ${font}`, color: fg1 }}>{sku.name}</div>
                    <div style={{ font: `500 11px/1.3 ${font}`, color: fg3 }}>{sku.category}</div>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ background: sc.bg, color: sc.fg, font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>{sku.maturityStage.replace('-', ' ')}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <span style={{ font: `600 11px/1 ${font}`, color: ec.text, textTransform: 'capitalize' }}>{sku.efficiency.replace('-', ' ')}</span>
                  </td>
                  <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{sku.daysInAssortment}</td>
                  <td style={{ padding: '12px 14px', font: `600 12px/1 ${mono}`, color: fg1, textAlign: 'right' }}>{sku.weeklyUnitsSold}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <span style={{ font: `500 12px/1 ${mono}`, color: sku.availability >= 90 ? '#047538' : sku.availability >= 70 ? '#8F5D00' : '#D62D0B' }}>{sku.availability}%</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <span style={{ font: `500 12px/1 ${mono}`, color: sku.daysOnHand <= LIFECYCLE_THRESHOLDS.targetDaysOnHand ? '#047538' : sku.daysOnHand <= LIFECYCLE_THRESHOLDS.warningDaysOnHand ? '#8F5D00' : '#D62D0B' }}>{sku.daysOnHand}</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <span style={{ font: `500 12px/1 ${mono}`, color: sku.shrinkage <= 10 ? '#047538' : sku.shrinkage <= 20 ? '#8F5D00' : '#D62D0B' }}>{sku.shrinkage}%</span>
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    {sku.recommendedAction ? (
                      <button style={{ padding: '5px 12px', borderRadius: 6, border: '1px solid #E9EAEC', background: '#fff', color: '#4629FF', font: `600 11px/1 ${font}`, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        {sku.recommendedAction.type === 'discontinue' ? 'Discontinue' :
                         sku.recommendedAction.type === 'clearance' ? `Clear ${sku.clearanceDiscount}%` :
                         sku.recommendedAction.type === 'status-on-hold' ? 'Hold' :
                         sku.recommendedAction.type === 'range-expansion' ? 'Expand' :
                         sku.recommendedAction.type === 'supplier-negotiation' ? 'Negotiate' : 'Review'}
                      </button>
                    ) : (
                      <span style={{ font: `500 11px/1 ${font}`, color: fg3 }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
