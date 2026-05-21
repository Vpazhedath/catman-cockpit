'use client';

import { useMemo, useCallback, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { exportData, generateFilename, ExportColumn } from '@/lib/export';
import { ExportButton } from '@/components/ExportButton';
import { SAMPLE_SUPPLIER_SCORECARD, SUPPLIER_SEGMENTS, SupplierScorecard } from '@/lib/sample-data';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';

const riskColors: Record<string, string> = { low: '#047538', medium: '#8F5D00', high: '#D62D0B' };
const riskBg: Record<string, string> = { low: '#E5F5EC', medium: '#FFF8DF', high: '#FCEBE8' };

export default function ProfitabilityPage() {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierScorecard | null>(null);

  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfPrimary = t ? '#1E1E20' : '#fff';
  const surfSecondary = t ? '#343437' : '#F4F5F6';
  const border = t ? '#343437' : '#E9EAEC';

  const card: React.CSSProperties = { background: surfPrimary, border: `1px solid ${border}`, borderRadius: 12, padding: 20 };

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    if (selectedSegment === 'all') return SAMPLE_SUPPLIER_SCORECARD;
    return SAMPLE_SUPPLIER_SCORECARD.filter(s => s.segment === selectedSegment);
  }, [selectedSegment]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const total = SAMPLE_SUPPLIER_SCORECARD.length;
    const keyAccounts = SAMPLE_SUPPLIER_SCORECARD.filter(s => s.segment === 'key-accounts').length;
    const avgScore = Math.round(SAMPLE_SUPPLIER_SCORECARD.reduce((a, s) => a + s.totalScore, 0) / total);
    const totalOpportunity = SAMPLE_SUPPLIER_SCORECARD.reduce((a, s) => a + s.opportunityValue, 0);
    const belowThreshold = SAMPLE_SUPPLIER_SCORECARD.filter(s => s.totalScore < 50).length;
    const totalGmv = SAMPLE_SUPPLIER_SCORECARD.reduce((a, s) => a + s.gmv, 0);
    const avgMargin = (SAMPLE_SUPPLIER_SCORECARD.reduce((a, s) => a + s.totalMargin, 0) / total).toFixed(1);
    const noBackMargin = SAMPLE_SUPPLIER_SCORECARD.filter(s => !s.hasBackMarginAgreement).length;

    return { total, keyAccounts, avgScore, totalOpportunity, belowThreshold, totalGmv, avgMargin, noBackMargin };
  }, []);

  // Segment distribution for chart
  const segmentDistribution = useMemo(() => {
    const segments = ['key-accounts', 'standard', 'niche', 'long-tail'] as const;
    return segments.map(seg => ({
      ...SUPPLIER_SEGMENTS[seg],
      segment: seg,
      count: SAMPLE_SUPPLIER_SCORECARD.filter(s => s.segment === seg).length,
      gmvShare: Math.round(SAMPLE_SUPPLIER_SCORECARD.filter(s => s.segment === seg).reduce((a, s) => a + s.gmvShare, 0)),
    }));
  }, []);

  // Export columns
  const supplierExportColumns: ExportColumn<SupplierScorecard>[] = useMemo(() => [
    { header: 'Supplier', key: 'name' },
    { header: 'Segment', key: 'segment', formatter: (val) => SUPPLIER_SEGMENTS[val as keyof typeof SUPPLIER_SEGMENTS]?.label || String(val) },
    { header: 'Total Score', key: 'totalScore' },
    { header: 'Commercial Score', key: 'commercialScore' },
    { header: 'Ops Score', key: 'opsScore' },
    { header: 'Total Margin %', key: 'totalMargin', formatter: (val) => `${val}%` },
    { header: 'Front Margin %', key: 'frontMargin', formatter: (val) => `${val}%` },
    { header: 'Back Margin %', key: 'backMargin', formatter: (val) => `${val}%` },
    { header: 'Fill Rate %', key: 'fillRate', formatter: (val) => `${val}%` },
    { header: 'GMV (AED)', key: 'gmv', formatter: (val) => `AED ${Number(val).toLocaleString()}` },
    { header: 'Risk Level', key: 'risk', formatter: (val) => String(val).toUpperCase() },
    { header: 'Opportunity (AED)', key: 'opportunityValue', formatter: (val) => val ? `AED ${Number(val).toLocaleString()}` : '-' },
  ], []);

  const handleExport = useCallback((format: 'csv' | 'xlsx') => {
    exportData(filteredSuppliers, supplierExportColumns, generateFilename('supplier-scorecard-sps'), format);
  }, [filteredSuppliers, supplierExportColumns]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Supplier Performance Scorecard</div>
          <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Profitability Engine · SPS v1 methodology for supplier evaluation</div>
        </div>
        <ExportButton onExport={handleExport} isDark={t} />
      </div>

      {/* KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { l: 'Avg Supplier Score', v: `${summaryMetrics.avgScore}/100`, c: '#4629FF' },
          { l: 'Avg Total Margin', v: `${summaryMetrics.avgMargin}%`, c: fg1 },
          { l: 'Opportunity Value', v: `AED ${summaryMetrics.totalOpportunity.toLocaleString()}`, c: '#047538' },
          { l: 'Below Threshold', v: String(summaryMetrics.belowThreshold), c: '#D62D0B' },
          { l: 'No BM Agreement', v: String(summaryMetrics.noBackMargin), c: '#8F5D00' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.c, marginTop: 6 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Main Content: Segmentation + Scorecard */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        {/* Segmentation Panel */}
        <div style={card}>
          <div style={{ font: `700 14px/1.4 ${font}`, color: fg1, marginBottom: 12 }}>Supplier Segmentation</div>
          <div style={{ font: `500 11px/1.4 ${font}`, color: fg3, marginBottom: 16 }}>Based on Importance & Productivity</div>

          {/* Mini Quadrant Chart */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', marginBottom: 16 }}>
            {/* Grid lines */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: border }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: border }} />

            {/* Quadrant labels */}
            <div style={{ position: 'absolute', top: 8, left: 8, font: `600 9px/1 ${font}`, color: fg3 }}>Key Accounts</div>
            <div style={{ position: 'absolute', top: 8, right: 8, font: `600 9px/1 ${font}`, color: fg3 }}>Niche</div>
            <div style={{ position: 'absolute', bottom: 8, left: 8, font: `600 9px/1 ${font}`, color: fg3 }}>Standard</div>
            <div style={{ position: 'absolute', bottom: 8, right: 8, font: `600 9px/1 ${font}`, color: fg3 }}>Long Tail</div>

            {/* Axis labels */}
            <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'rotate(-90deg) translateX(-50%)', transformOrigin: 'left center', font: `500 8px/1 ${font}`, color: fg3, whiteSpace: 'nowrap' }}>Productivity →</div>
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', font: `500 8px/1 ${font}`, color: fg3 }}>Importance →</div>

            {/* Plot suppliers */}
            {SAMPLE_SUPPLIER_SCORECARD.map((sup, i) => {
              // Map scores to positions (0-100 -> 0-100% of quadrant)
              const x = sup.importanceScore; // Higher = right
              const y = 100 - (sup.totalScore * 0.8 + sup.commercialScore * 0.2); // Higher = top (inverted)
              return (
                <div
                  key={sup.id}
                  onClick={() => setSelectedSupplier(sup)}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: selectedSupplier?.id === sup.id ? '#D62D0B' : SUPPLIER_SEGMENTS[sup.segment].color,
                    cursor: 'pointer',
                    transition: 'transform 150ms, background 150ms',
                    ...(selectedSupplier?.id === sup.id && { transform: 'translate(-50%, -50%) scale(1.5)' }),
                  }}
                  title={sup.name}
                />
              );
            })}
          </div>

          {/* Segment Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {segmentDistribution.map(seg => (
              <button
                key={seg.segment}
                onClick={() => setSelectedSegment(selectedSegment === seg.segment ? 'all' : seg.segment)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${selectedSegment === seg.segment ? seg.color : 'transparent'}`,
                  background: selectedSegment === seg.segment ? (t ? `${seg.color}18` : `${seg.color}12`) : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ font: `600 12px/1 ${font}`, color: fg1 }}>{seg.label}</div>
                  <div style={{ font: `500 10px/1 ${font}`, color: fg3, marginTop: 2 }}>{seg.count} suppliers · {seg.gmvShare}% GMV</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Supplier Scorecard Table */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>Supplier Scorecard</div>
              <div style={{ font: `500 11px/1.4 ${font}`, color: fg3, marginTop: 2 }}>{filteredSuppliers.length} suppliers shown</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'low', 'medium', 'high'].map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedSegment(r === 'all' ? 'all' : selectedSegment)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 200,
                    border: '1px solid transparent',
                    background: 'transparent',
                    font: `600 10px/1 ${font}`,
                    color: fg3,
                    cursor: 'pointer',
                  }}
                >
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <thead>
                <tr style={{ background: surfSecondary }}>
                  {['Supplier', 'Segment', 'Score', 'FM%', 'BM%', 'Total M%', 'Fill Rate', 'GMV', 'Risk', 'Action'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Supplier' || h === 'Segment' ? 'left' : h === 'Action' ? 'center' : 'right', padding: '10px 12px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((sup) => (
                  <tr
                    key={sup.id}
                    onClick={() => setSelectedSupplier(sup)}
                    style={{
                      borderBottom: `1px solid ${border}`,
                      cursor: 'pointer',
                      background: selectedSupplier?.id === sup.id ? (t ? 'rgba(70,41,255,0.06)' : 'rgba(70,41,255,0.02)') : 'transparent',
                    }}
                  >
                    <td style={{ padding: '12px', font: `600 13px/1 ${font}`, color: fg1 }}>{sup.name}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: `${SUPPLIER_SEGMENTS[sup.segment].color}18`, color: SUPPLIER_SEGMENTS[sup.segment].color, font: `600 9px/1 ${font}`, padding: '4px 8px', borderRadius: 200 }}>
                        {SUPPLIER_SEGMENTS[sup.segment].label}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                        <div style={{ width: 48, height: 5, background: surfSecondary, borderRadius: 200, overflow: 'hidden' }}>
                          <div style={{ width: `${sup.totalScore}%`, height: '100%', background: riskColors[sup.risk], borderRadius: 200 }} />
                        </div>
                        <span style={{ font: `600 11px/1 ${mono}`, color: riskColors[sup.risk] }}>{sup.totalScore}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{sup.frontMargin}%</td>
                    <td style={{ padding: '12px', font: `500 12px/1 ${mono}`, color: sup.hasBackMarginAgreement ? fg2 : '#D62D0B', textAlign: 'right' }}>
                      {sup.backMargin > 0 ? `${sup.backMargin}%` : '—'}
                      {!sup.hasBackMarginAgreement && <span style={{ marginLeft: 4, fontSize: 10 }}>⚠</span>}
                    </td>
                    <td style={{ padding: '12px', font: `600 12px/1 ${mono}`, color: sup.totalMargin >= 25 ? '#047538' : sup.totalMargin >= 20 ? '#8F5D00' : '#D62D0B', textAlign: 'right' }}>{sup.totalMargin}%</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                        <span style={{ font: `500 12px/1 ${mono}`, color: sup.fillRate >= 85 ? '#047538' : '#D62D0B' }}>{sup.fillRate}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>AED {(sup.gmv / 1000).toFixed(0)}K</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <span style={{ background: t ? `${riskColors[sup.risk]}18` : riskBg[sup.risk], color: riskColors[sup.risk], font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize' }}>{sup.risk}</span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {sup.opportunityValue > 0 && (
                        <button style={{ border: 0, background: '#4629FF', color: '#fff', font: `600 10px/1 ${font}`, padding: '5px 10px', borderRadius: 200, cursor: 'pointer' }}>
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Opportunity Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Opportunities */}
        <div style={card}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 12 }}>Margin Opportunities</div>
          <div style={{ font: `500 11px/1.4 ${font}`, color: fg3, marginBottom: 16 }}>Identified savings potential</div>

          {SAMPLE_SUPPLIER_SCORECARD.filter(s => s.opportunityValue > 0).map((sup) => (
            <div key={sup.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px', background: surfSecondary, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: t ? 'rgba(4,117,56,0.15)' : '#E5F5EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#047538" strokeWidth="2">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ font: `600 13px/1 ${font}`, color: fg1 }}>{sup.name}</span>
                  <span style={{ font: `700 14px/1 ${font}`, color: '#047538' }}>AED {sup.opportunityValue.toLocaleString()}</span>
                </div>
                <div style={{ font: `500 11px/1.4 ${font}`, color: fg2, marginTop: 4 }}>
                  {!sup.hasBackMarginAgreement && 'No Back Margin agreement · '}
                  {sup.fillRate < 80 && `Low Fill Rate (${sup.fillRate}%) · `}
                  {sup.yoyGpvGrowth < 0 && `GPV declining ${sup.yoyGpvGrowth}%`}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button style={{ border: `1px solid ${border}`, background: 'transparent', color: fg2, font: `600 10px/1 ${font}`, padding: '5px 10px', borderRadius: 200, cursor: 'pointer' }}>View Details</button>
                  <button style={{ border: 0, background: '#4629FF', color: '#fff', font: `600 10px/1 ${font}`, padding: '5px 10px', borderRadius: 200, cursor: 'pointer' }}>Initiate Negotiation</button>
                </div>
              </div>
            </div>
          ))}

          {SAMPLE_SUPPLIER_SCORECARD.filter(s => s.opportunityValue > 0).length === 0 && (
            <div style={{ textAlign: 'center', padding: 32, color: fg3 }}>
              <div style={{ font: `500 14px/1 ${font}` }}>No opportunities identified</div>
            </div>
          )}
        </div>

        {/* Methodology Summary */}
        <div style={card}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1, marginBottom: 12 }}>SPS Methodology</div>
          <div style={{ font: `500 11px/1.4 ${font}`, color: fg3, marginBottom: 16 }}>How suppliers are scored</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 14px', background: surfSecondary, borderRadius: 8 }}>
              <div style={{ font: `600 12px/1 ${font}`, color: fg1, marginBottom: 6 }}>Step 1: Segmentation</div>
              <div style={{ font: `500 11px/1.4 ${font}`, color: fg2 }}>Suppliers are categorized into 4 tiers based on Net Retail Profit (Importance) and Customer Frequency/Penetration (Productivity).</div>
            </div>
            <div style={{ padding: '12px 14px', background: surfSecondary, borderRadius: 8 }}>
              <div style={{ font: `600 12px/1 ${font}`, color: fg1, marginBottom: 6 }}>Step 2: Scoring</div>
              <div style={{ font: `500 11px/1.4 ${font}`, color: fg2 }}>
                <strong>Commercial (40%):</strong> Front Margin, Back Margin, Promo GPV, YoY Growth
                <br />
                <strong>Operations (60%):</strong> Fill Rate, On-Time Delivery, Efficiency
              </div>
            </div>
            <div style={{ padding: '12px 14px', background: surfSecondary, borderRadius: 8 }}>
              <div style={{ font: `600 12px/1 ${font}`, color: fg1, marginBottom: 6 }}>Step 3: Action</div>
              <div style={{ font: `500 11px/1.4 ${font}`, color: fg2 }}>Suppliers below threshold are flagged for renegotiation, with opportunity value calculated based on margin gaps.</div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: '12px 14px', background: t ? 'rgba(70,41,255,0.1)' : '#EDEBFF', borderRadius: 8 }}>
            <div style={{ font: `600 12px/1 ${font}`, color: '#4629FF', marginBottom: 4 }}>💡 Tip</div>
            <div style={{ font: `500 11px/1.4 ${font}`, color: fg2 }}>Use the scorecard to prepare for supplier negotiations. Focus on Back Margin agreements and Fill Rate improvements for high-impact opportunities.</div>
          </div>
        </div>
      </div>
    </div>
  );
}