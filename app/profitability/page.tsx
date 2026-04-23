'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ZAxis, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

// ─── SPS Segmentation Tiers ──────────────────────────────
type Segment = 'Key Accounts' | 'Standard' | 'Niche' | 'Long Tail';
type RiskLevel = 'low' | 'medium' | 'high';

const SEGMENT_COLORS: Record<Segment, string> = {
  'Key Accounts': '#4629FF',
  'Standard': '#047538',
  'Niche': '#8F5D00',
  'Long Tail': '#D62D0B',
};

const RISK_COLORS: Record<RiskLevel, string> = { low: '#047538', medium: '#8F5D00', high: '#D62D0B' };
const RISK_BG: Record<RiskLevel, string> = { low: '#E5F5EC', medium: '#FFF8DF', high: '#FCEBE8' };

// ─── SPS Supplier Data ───────────────────────────────────
interface SPSSupplier {
  supplier: string;
  segment: Segment;
  category: string;
  netRetailProfit: number;
  abvOrder: number;
  customerFrequency: number;
  customerPenetration: number;
  importanceScore: number;
  productivityScore: number;
  fillRate: number;
  otd: number;
  yoyGpvGrowth: number;
  efficiency: number;
  promoGpvContr: number;
  frontMargin: number;
  backMargin: number;
  opsScore: number;
  commercialScore: number;
  totalScore: number;
  gpv: number;
  gpvShare: number;
  cogs: number;
  supplierFunding: number;
  totalMargin: number;
  availability: number;
  skuCount: number;
  isVMI: boolean;
}

function getRisk(score: number): RiskLevel {
  if (score >= 55) return 'low';
  if (score >= 35) return 'medium';
  return 'high';
}

const SPS_SUPPLIERS: SPSSupplier[] = [
  { supplier: 'Almarai', segment: 'Key Accounts', category: 'Dairy', netRetailProfit: 285, abvOrder: 18.5, customerFrequency: 2.4, customerPenetration: 31.2, importanceScore: 95, productivityScore: 72, fillRate: 88.5, otd: 82.1, yoyGpvGrowth: 14.2, efficiency: 78.3, promoGpvContr: 12.8, frontMargin: 28.4, backMargin: 4.2, opsScore: 72, commercialScore: 58, totalScore: 65, gpv: 892, gpvShare: 18.2, cogs: 641, supplierFunding: 8.5, totalMargin: 32.6, availability: 94.1, skuCount: 42, isVMI: true },
  { supplier: 'Nestle', segment: 'Key Accounts', category: 'Beverages', netRetailProfit: 198, abvOrder: 15.2, customerFrequency: 2.1, customerPenetration: 28.6, importanceScore: 82, productivityScore: 65, fillRate: 75.5, otd: 66.7, yoyGpvGrowth: 20.0, efficiency: 56.0, promoGpvContr: 12.8, frontMargin: 17.0, backMargin: 5.0, opsScore: 49, commercialScore: 38, totalScore: 44, gpv: 624, gpvShare: 12.8, cogs: 518, supplierFunding: 3.2, totalMargin: 22.0, availability: 85.7, skuCount: 35, isVMI: false },
  { supplier: 'Coca-Cola', segment: 'Key Accounts', category: 'Beverages', netRetailProfit: 165, abvOrder: 14.8, customerFrequency: 1.9, customerPenetration: 25.4, importanceScore: 78, productivityScore: 58, fillRate: 91.6, otd: 39.2, yoyGpvGrowth: 37.1, efficiency: 73.2, promoGpvContr: 6.2, frontMargin: 21.1, backMargin: 3.4, opsScore: 71, commercialScore: 36, totalScore: 54, gpv: 520, gpvShare: 10.6, cogs: 410, supplierFunding: 4.8, totalMargin: 24.5, availability: 82.5, skuCount: 18, isVMI: true },
  { supplier: 'PepsiCo', segment: 'Key Accounts', category: 'Beverages', netRetailProfit: 142, abvOrder: 13.5, customerFrequency: 1.8, customerPenetration: 22.8, importanceScore: 72, productivityScore: 55, fillRate: 78.1, otd: 63.0, yoyGpvGrowth: 20.0, efficiency: 64.0, promoGpvContr: 9.0, frontMargin: 23.0, backMargin: 0.0, opsScore: 62, commercialScore: 29, totalScore: 46, gpv: 448, gpvShare: 9.2, cogs: 345, supplierFunding: 2.3, totalMargin: 23.0, availability: 78.0, skuCount: 22, isVMI: false },
  { supplier: 'GTRC Mars', segment: 'Key Accounts', category: 'Confectionery', netRetailProfit: 57, abvOrder: 11.0, customerFrequency: 1.86, customerPenetration: 22.6, importanceScore: 100, productivityScore: 47, fillRate: 56.0, otd: 19.0, yoyGpvGrowth: 20.0, efficiency: 64.0, promoGpvContr: 9.0, frontMargin: 22.3, backMargin: 0.0, opsScore: 41, commercialScore: 24, totalScore: 33, gpv: 148, gpvShare: 13.0, cogs: 116, supplierFunding: 2.3, totalMargin: 23.3, availability: 74.4, skuCount: 15, isVMI: false },
  { supplier: 'Fergulf', segment: 'Key Accounts', category: 'Confectionery', netRetailProfit: 125, abvOrder: 16.2, customerFrequency: 2.0, customerPenetration: 24.1, importanceScore: 85, productivityScore: 62, fillRate: 72.0, otd: 48.0, yoyGpvGrowth: 38.0, efficiency: 87.0, promoGpvContr: 17.0, frontMargin: 23.0, backMargin: 2.0, opsScore: 62, commercialScore: 46, totalScore: 54, gpv: 188, gpvShare: 17.0, cogs: 145, supplierFunding: 0, totalMargin: 24.5, availability: 72.7, skuCount: 12, isVMI: false },
  { supplier: 'Red Bull', segment: 'Standard', category: 'Beverages', netRetailProfit: 68, abvOrder: 9.2, customerFrequency: 1.3, customerPenetration: 12.8, importanceScore: 55, productivityScore: 28, fillRate: 82.0, otd: 75.0, yoyGpvGrowth: 5.8, efficiency: 85.0, promoGpvContr: 8.5, frontMargin: 35.0, backMargin: 3.5, opsScore: 59, commercialScore: 52, totalScore: 56, gpv: 180, gpvShare: 3.7, cogs: 117, supplierFunding: 1.2, totalMargin: 38.5, availability: 97.0, skuCount: 4, isVMI: false },
  { supplier: 'Lacnor', segment: 'Standard', category: 'Beverages', netRetailProfit: 52, abvOrder: 8.4, customerFrequency: 1.5, customerPenetration: 14.2, importanceScore: 48, productivityScore: 32, fillRate: 79.8, otd: 90.0, yoyGpvGrowth: 18.3, efficiency: 65.0, promoGpvContr: 29.3, frontMargin: 17.1, backMargin: 4.7, opsScore: 84, commercialScore: 48, totalScore: 66, gpv: 109, gpvShare: 2.2, cogs: 76, supplierFunding: 0.5, totalMargin: 30.7, availability: 78.0, skuCount: 8, isVMI: false },
  { supplier: 'Nadec', segment: 'Standard', category: 'Dairy', netRetailProfit: 45, abvOrder: 7.8, customerFrequency: 1.4, customerPenetration: 11.5, importanceScore: 42, productivityScore: 25, fillRate: 85.0, otd: 70.0, yoyGpvGrowth: 8.2, efficiency: 72.0, promoGpvContr: 15.0, frontMargin: 29.0, backMargin: 2.5, opsScore: 59, commercialScore: 44, totalScore: 52, gpv: 145, gpvShare: 3.0, cogs: 103, supplierFunding: 0.8, totalMargin: 31.5, availability: 88.0, skuCount: 12, isVMI: false },
  { supplier: 'Barakat', segment: 'Standard', category: 'Dairy', netRetailProfit: 38, abvOrder: 6.5, customerFrequency: 1.2, customerPenetration: 9.8, importanceScore: 45, productivityScore: 18, fillRate: 62.1, otd: 66.7, yoyGpvGrowth: -1.1, efficiency: 70.3, promoGpvContr: 0.4, frontMargin: 30.0, backMargin: 0.8, opsScore: 64, commercialScore: 25, totalScore: 45, gpv: 77, gpvShare: 1.6, cogs: 54, supplierFunding: 0.1, totalMargin: 30.7, availability: 78.0, skuCount: 6, isVMI: false },
  { supplier: 'Mondelez', segment: 'Niche', category: 'Confectionery', netRetailProfit: 22, abvOrder: 12.0, customerFrequency: 1.6, customerPenetration: 18.5, importanceScore: 28, productivityScore: 48, fillRate: 70.0, otd: 55.0, yoyGpvGrowth: 12.0, efficiency: 60.0, promoGpvContr: 22.0, frontMargin: 25.0, backMargin: 3.0, opsScore: 44, commercialScore: 42, totalScore: 43, gpv: 85, gpvShare: 1.7, cogs: 64, supplierFunding: 1.0, totalMargin: 28.0, availability: 82.0, skuCount: 8, isVMI: false },
  { supplier: 'Ferrero', segment: 'Niche', category: 'Confectionery', netRetailProfit: 18, abvOrder: 14.5, customerFrequency: 1.1, customerPenetration: 16.2, importanceScore: 22, productivityScore: 45, fillRate: 65.0, otd: 50.0, yoyGpvGrowth: 8.0, efficiency: 55.0, promoGpvContr: 18.0, frontMargin: 30.0, backMargin: 1.5, opsScore: 39, commercialScore: 38, totalScore: 39, gpv: 62, gpvShare: 1.3, cogs: 43, supplierFunding: 0.5, totalMargin: 31.5, availability: 76.0, skuCount: 5, isVMI: false },
  { supplier: 'Gulf Resources', segment: 'Long Tail', category: 'Grocery', netRetailProfit: 8, abvOrder: 5.2, customerFrequency: 0.8, customerPenetration: 4.5, importanceScore: 12, productivityScore: 12, fillRate: 45.0, otd: 35.0, yoyGpvGrowth: -5.0, efficiency: 40.0, promoGpvContr: 2.0, frontMargin: 18.0, backMargin: 0.0, opsScore: 27, commercialScore: 15, totalScore: 21, gpv: 28, gpvShare: 0.6, cogs: 23, supplierFunding: 0, totalMargin: 18.0, availability: 61.0, skuCount: 18, isVMI: false },
  { supplier: 'Food Stores General', segment: 'Long Tail', category: 'Grocery', netRetailProfit: 5, abvOrder: 4.8, customerFrequency: 0.7, customerPenetration: 3.2, importanceScore: 8, productivityScore: 8, fillRate: 20.0, otd: 29.0, yoyGpvGrowth: -10.0, efficiency: 51.0, promoGpvContr: 1.0, frontMargin: 35.0, backMargin: 4.0, opsScore: 23, commercialScore: 24, totalScore: 24, gpv: 58, gpvShare: 5.0, cogs: 38, supplierFunding: 0, totalMargin: 39.2, availability: 61.1, skuCount: 25, isVMI: false },
];

// ─── Segment Summary ─────────────────────────────────────
const SEGMENT_SUMMARY = [
  { segment: 'Key Accounts' as Segment, count: 6, gpvShare: 70, profitShare: 65 },
  { segment: 'Standard' as Segment, count: 4, gpvShare: 18, profitShare: 22 },
  { segment: 'Niche' as Segment, count: 2, gpvShare: 2, profitShare: 3 },
  { segment: 'Long Tail' as Segment, count: 2, gpvShare: 9, profitShare: 11 },
];

// ─── SPS Opportunities ──────────────────────────────────
interface SPSOpportunity {
  supplier: string;
  segment: Segment;
  opportunity: string;
  action: string;
  yearlySizing: number;
  status: 'Completed' | 'In Progress' | 'Not Started';
  type: 'Margin Expansion' | 'Growth Opportunity';
}

const SPS_OPPORTUNITIES: SPSOpportunity[] = [
  { supplier: 'GTRC Mars', segment: 'Key Accounts', opportunity: 'No Back Margin agreement', action: 'Negotiate at least 1% BM%', yearlySizing: 8.0, status: 'In Progress', type: 'Margin Expansion' },
  { supplier: 'GTRC Mars', segment: 'Key Accounts', opportunity: 'Lowest Fill Rate (56%) & OTD (19%)', action: 'Aim Fill Rate ~72% (Fergulf parity)', yearlySizing: 44.0, status: 'Not Started', type: 'Growth Opportunity' },
  { supplier: 'PepsiCo', segment: 'Key Accounts', opportunity: 'No Back Margin despite high GPV', action: 'Negotiate warehouse allowance rebate', yearlySizing: 4.1, status: 'Completed', type: 'Margin Expansion' },
  { supplier: 'PepsiCo', segment: 'Key Accounts', opportunity: 'Minimal promo contribution', action: 'Secure monthly promos for 7 key SKUs', yearlySizing: 10.6, status: 'Completed', type: 'Growth Opportunity' },
  { supplier: 'Barakat', segment: 'Standard', opportunity: 'GPV YoY decline (-1.1%)', action: 'Negotiate contractual NMR', yearlySizing: 12.5, status: 'In Progress', type: 'Growth Opportunity' },
  { supplier: 'Nestle', segment: 'Key Accounts', opportunity: 'Front Margin 17% — below avg 24%', action: 'Renegotiate cost price to benchmark', yearlySizing: 18.4, status: 'Not Started', type: 'Margin Expansion' },
];

// ─── Score Trend ─────────────────────────────────────────
const SCORE_TREND = [
  { quarter: "Q1 '25", avgOps: 48.2, avgCommercial: 32.5, avgTotal: 40.4 },
  { quarter: "Q2 '25", avgOps: 50.8, avgCommercial: 34.1, avgTotal: 42.5 },
  { quarter: "Q3 '25", avgOps: 53.1, avgCommercial: 35.8, avgTotal: 44.5 },
  { quarter: "Q4 '25", avgOps: 55.6, avgCommercial: 37.2, avgTotal: 46.4 },
  { quarter: "Q1 '26", avgOps: 56.8, avgCommercial: 38.9, avgTotal: 47.9 },
];

// ─── Scoring Weights ────────────────────────────────────
const SCORING_WEIGHTS = {
  ops: [
    { label: 'Fill Rate %', weight: 60 },
    { label: 'On Time Delivery %', weight: 40 },
  ],
  commercial: [
    { label: 'Back Margin %', weight: 25 },
    { label: 'Efficiency %', weight: 30 },
    { label: 'Promo GPV Contr. %', weight: 20 },
    { label: 'Front Margin %', weight: 15 },
    { label: 'YoY GPV Growth %', weight: 10 },
  ],
};

// ═════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════
export default function ProfitabilityPage() {
  const [selectedSegment, setSelectedSegment] = useState<'all' | Segment>('all');
  const [sortBy, setSortBy] = useState<'totalScore' | 'opsScore' | 'commercialScore' | 'gpv'>('totalScore');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'segmentation' | 'scoring'>('segmentation');

  const filteredSuppliers = useMemo(() => {
    let data = [...SPS_SUPPLIERS];
    if (selectedSegment !== 'all') data = data.filter(s => s.segment === selectedSegment);
    data.sort((a, b) => b[sortBy] - a[sortBy]);
    return data;
  }, [selectedSegment, sortBy]);

  const stats = useMemo(() => {
    const all = SPS_SUPPLIERS;
    return {
      avgTotal: (all.reduce((s, x) => s + x.totalScore, 0) / all.length).toFixed(0),
      belowThreshold: all.filter(x => x.totalScore < 40).length,
      totalOpportunity: SPS_OPPORTUNITIES.reduce((s, x) => s + x.yearlySizing, 0),
      supplierCount: all.length,
    };
  }, []);

  // Scatter chart data
  const scatterData = SPS_SUPPLIERS.map(s => activeView === 'segmentation'
    ? { x: s.productivityScore, y: s.importanceScore, z: s.gpv, name: s.supplier, segment: s.segment, fill: SEGMENT_COLORS[s.segment] }
    : { x: s.commercialScore, y: s.opsScore, z: s.gpv, name: s.supplier, segment: s.segment, fill: SEGMENT_COLORS[s.segment] }
  );

  // Radar data for selected supplier
  const radarData = selectedSupplier ? (() => {
    const s = SPS_SUPPLIERS.find(x => x.supplier === selectedSupplier);
    if (!s) return [];
    return [
      { metric: 'Fill Rate', value: s.fillRate, fullMark: 100 },
      { metric: 'OTD', value: s.otd, fullMark: 100 },
      { metric: 'Efficiency', value: s.efficiency, fullMark: 100 },
      { metric: 'Front Margin', value: (s.frontMargin / 40) * 100, fullMark: 100 },
      { metric: 'Back Margin', value: (s.backMargin / 15) * 100, fullMark: 100 },
      { metric: 'Promo Contr.', value: (s.promoGpvContr / 50) * 100, fullMark: 100 },
      { metric: 'YoY Growth', value: Math.max(0, (s.yoyGpvGrowth / 50) * 100), fullMark: 100 },
    ];
  })() : [];

  /* ── Styles matching the new design system ── */
  const card: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #E9EAEC',
    borderRadius: 12,
    padding: 20,
  };

  const fg1 = '#141415';
  const fg2 = '#6C6D73';
  const fg3 = '#93949D';

  const statusColors: Record<string, { bg: string; fg: string }> = {
    Completed: { bg: '#E5F5EC', fg: '#047538' },
    'In Progress': { bg: '#FFF8DF', fg: '#8F5D00' },
    'Not Started': { bg: '#F4F5F6', fg: '#93949D' },
  };

  const typeColors: Record<string, { bg: string; fg: string }> = {
    'Margin Expansion': { bg: '#EDEBFF', fg: '#4629FF' },
    'Growth Opportunity': { bg: '#E5F5EC', fg: '#047538' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Page Header ── */}
      <div>
        <div style={{ font: '700 28px/1.25 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', letterSpacing: '-0.01em', color: fg1 }}>
          Supplier Performance Scorecard
        </div>
        <div style={{ font: '500 14px/1.5 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg2, marginTop: 4 }}>
          Profitability Engine · SPS v1 — Segmentation, Scoring & Opportunity Detection
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Avg Supplier Score', v: `${stats.avgTotal}/100`, c: '#4629FF' },
          { l: 'Below Threshold', v: String(stats.belowThreshold), c: '#D62D0B' },
          { l: 'Renegotiation Opp.', v: `EUR ${stats.totalOpportunity.toFixed(0)}K`, c: '#047538' },
          { l: 'Active Suppliers', v: String(stats.supplierCount), c: fg1 },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: '500 11px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
            <div style={{ font: '700 22px/1.2 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: s.c, marginTop: 6 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* ── Segmentation / Scoring Chart + Segment Breakdown ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Chart */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['segmentation', 'scoring'] as const).map(v => (
                <button key={v} onClick={() => setActiveView(v)} style={{
                  display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 200, cursor: 'pointer',
                  font: '600 12px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
                  background: activeView === v ? '#4629FF' : 'transparent',
                  color: activeView === v ? '#fff' : fg2,
                  border: `1px solid ${activeView === v ? '#4629FF' : '#E9EAEC'}`,
                }}>
                  {v === 'segmentation' ? 'Segmentation' : 'Scoring Quadrant'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {Object.entries(SEGMENT_COLORS).map(([seg, color]) => (
                <div key={seg} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                  <span style={{ font: '500 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3 }}>{seg}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ font: '500 11px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3, marginBottom: 12 }}>
            {activeView === 'segmentation'
              ? 'Importance (Y) vs Productivity (X) — bubble size = GPV'
              : 'Ops Score (Y) vs Commercial Score (X) — Leverage/Expand vs Monitor/Replace'}
          </div>
          <div style={{ height: 320, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E9EAEC" />
                <XAxis type="number" dataKey="x" domain={[0, 100]}
                  tick={{ fontSize: 10, fill: fg3 }} axisLine={false} tickLine={false}
                  label={{ value: activeView === 'segmentation' ? 'Productivity' : 'Commercial Score', position: 'insideBottom', offset: -10, fontSize: 10, fill: fg3 }}
                />
                <YAxis type="number" dataKey="y" domain={[0, 100]}
                  tick={{ fontSize: 10, fill: fg3 }} axisLine={false} tickLine={false}
                  label={{ value: activeView === 'segmentation' ? 'Importance' : 'Ops Score', angle: -90, position: 'insideLeft', offset: 5, fontSize: 10, fill: fg3 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 500]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141415', border: 'none', borderRadius: 8, color: '#fff', fontSize: 11, fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)' }}
                  labelFormatter={(_, payload) => {
                    const p = payload?.[0]?.payload;
                    return p ? `${p.name} (${p.segment})` : '';
                  }}
                />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} fillOpacity={0.75} stroke={entry.fill} strokeWidth={1} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            {/* Cutoff lines */}
            <div style={{ position: 'absolute', left: '48%', top: 10, bottom: 40, borderLeft: '1px dashed #D62D0B', opacity: 0.35 }} />
            <div style={{ position: 'absolute', left: 40, right: 20, top: activeView === 'segmentation' ? '45%' : '50%', borderTop: '1px dashed #D62D0B', opacity: 0.35 }} />
          </div>
        </div>

        {/* Right panel: Radar or Segment Breakdown */}
        <div style={card}>
          {selectedSupplier && radarData.length > 0 ? (() => {
            const s = SPS_SUPPLIERS.find(x => x.supplier === selectedSupplier)!;
            const risk = getRisk(s.totalScore);
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <div style={{ font: '700 16px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>{selectedSupplier}</div>
                    <div style={{ font: '500 11px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3 }}>SPS Metric Breakdown</div>
                  </div>
                  <button onClick={() => setSelectedSupplier(null)} style={{ border: 0, background: 'transparent', font: '500 11px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3, cursor: 'pointer' }}>Clear</button>
                </div>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius={70}>
                      <PolarGrid stroke="#E9EAEC" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: fg3 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                      <Radar name={selectedSupplier} dataKey="value" stroke="#4629FF" fill="#4629FF" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  {[
                    { l: 'Ops Score', v: s.opsScore },
                    { l: 'Commercial', v: s.commercialScore },
                    { l: 'Total Score', v: s.totalScore },
                    { l: 'Risk', v: risk },
                  ].map((m, i) => (
                    <div key={i} style={{ background: '#F4F5F6', borderRadius: 8, padding: '8px 10px' }}>
                      <div style={{ font: '500 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3 }}>{m.l}</div>
                      {typeof m.v === 'number' ? (
                        <div style={{ font: '700 18px/1.3 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: '#4629FF', marginTop: 2 }}>{m.v}</div>
                      ) : (
                        <span style={{ display: 'inline-block', marginTop: 4, background: RISK_BG[m.v as RiskLevel], color: RISK_COLORS[m.v as RiskLevel], font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize' }}>{m.v}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })() : (
            <div>
              <div style={{ font: '700 16px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1, marginBottom: 4 }}>Segment Breakdown</div>
              <div style={{ font: '500 11px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3, marginBottom: 16 }}>GPV & profit share by tier</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SEGMENT_SUMMARY.map(seg => {
                  const active = selectedSegment === seg.segment;
                  return (
                    <button key={seg.segment} onClick={() => setSelectedSegment(active ? 'all' : seg.segment)} style={{
                      display: 'block', width: '100%', textAlign: 'left', border: `1px solid ${active ? '#4629FF' : '#E9EAEC'}`,
                      borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                      background: active ? 'rgba(70,41,255,0.04)' : 'transparent',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: SEGMENT_COLORS[seg.segment] }} />
                          <span style={{ font: '600 12px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>{seg.segment}</span>
                        </div>
                        <span style={{ font: '500 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3 }}>{seg.count} suppliers</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <div style={{ font: '500 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3, marginBottom: 4 }}>GPV Share</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 4, background: '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                              <div style={{ width: `${seg.gpvShare}%`, height: '100%', background: SEGMENT_COLORS[seg.segment], borderRadius: 200 }} />
                            </div>
                            <span style={{ font: '600 10px/1 var(--font-mono, monospace)', color: fg1 }}>{seg.gpvShare}%</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ font: '500 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3, marginBottom: 4 }}>Profit Share</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 4, background: '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                              <div style={{ width: `${seg.profitShare}%`, height: '100%', background: '#047538', borderRadius: 200 }} />
                            </div>
                            <span style={{ font: '600 10px/1 var(--font-mono, monospace)', color: fg1 }}>{seg.profitShare}%</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Supplier Scorecard Table ── */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ font: '700 16px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>Supplier Scorecard</div>
            <div style={{ font: '500 12px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg2, marginTop: 2 }}>
              {filteredSuppliers.length} suppliers · Click row for radar detail
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'Key Accounts', 'Standard', 'Niche', 'Long Tail'] as const).map(seg => (
              <button key={seg} onClick={() => setSelectedSegment(seg)} style={{
                padding: '6px 12px', borderRadius: 200, cursor: 'pointer',
                font: '600 11px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
                background: selectedSegment === seg ? '#4629FF' : 'transparent',
                color: selectedSegment === seg ? '#fff' : fg2,
                border: `1px solid ${selectedSegment === seg ? '#4629FF' : '#E9EAEC'}`,
              }}>
                {seg === 'all' ? 'All' : seg}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F5F6' }}>
              {['Supplier', 'Segment', 'SKUs', 'Fill Rate', 'OTD', 'FM%', 'BM%', 'YoY GPV', 'Ops', 'Comm.', 'Total', 'Risk', 'Action'].map(h => (
                <th key={h} style={{
                  textAlign: h === 'Supplier' || h === 'Segment' ? 'left' : h === 'Action' ? 'center' : 'right',
                  padding: '10px 12px',
                  font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
                  color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((row, i) => {
              const risk = getRisk(row.totalScore);
              const isSelected = selectedSupplier === row.supplier;
              return (
                <tr key={i} onClick={() => setSelectedSupplier(isSelected ? null : row.supplier)} style={{
                  borderBottom: '1px solid #F4F5F6', cursor: 'pointer',
                  background: isSelected ? 'rgba(70,41,255,0.03)' : 'transparent',
                }}>
                  <td style={{ padding: '12px', font: '600 13px/1.3 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>
                    {row.supplier}
                    <div style={{ font: '500 10px/1.3 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg3 }}>{row.category}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: `${SEGMENT_COLORS[row.segment]}14`,
                      color: SEGMENT_COLORS[row.segment],
                      font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
                      padding: '4px 8px', borderRadius: 200,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: SEGMENT_COLORS[row.segment] }} />
                      {row.segment}
                    </span>
                  </td>
                  <td style={{ padding: '12px', font: '500 12px/1 var(--font-mono, monospace)', color: fg2, textAlign: 'right' }}>{row.skuCount}</td>
                  <td style={{ padding: '12px', font: '600 12px/1 var(--font-mono, monospace)', color: row.fillRate >= 80 ? '#047538' : row.fillRate >= 60 ? '#8F5D00' : '#D62D0B', textAlign: 'right' }}>{row.fillRate}%</td>
                  <td style={{ padding: '12px', font: '600 12px/1 var(--font-mono, monospace)', color: row.otd >= 70 ? '#047538' : row.otd >= 40 ? '#8F5D00' : '#D62D0B', textAlign: 'right' }}>{row.otd}%</td>
                  <td style={{ padding: '12px', font: '500 12px/1 var(--font-mono, monospace)', color: fg2, textAlign: 'right' }}>{row.frontMargin}%</td>
                  <td style={{ padding: '12px', font: '600 12px/1 var(--font-mono, monospace)', color: row.backMargin === 0 ? '#D62D0B' : fg2, textAlign: 'right' }}>
                    {row.backMargin === 0 ? '0% !' : `${row.backMargin}%`}
                  </td>
                  <td style={{ padding: '12px', font: '600 12px/1 var(--font-mono, monospace)', color: row.yoyGpvGrowth >= 0 ? '#047538' : '#D62D0B', textAlign: 'right' }}>
                    {row.yoyGpvGrowth > 0 ? '+' : ''}{row.yoyGpvGrowth}%
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <div style={{ width: 40, height: 5, background: '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                        <div style={{ width: `${row.opsScore}%`, height: '100%', background: RISK_COLORS[getRisk(row.opsScore)], borderRadius: 200 }} />
                      </div>
                      <span style={{ font: '600 11px/1 var(--font-mono, monospace)', color: RISK_COLORS[getRisk(row.opsScore)] }}>{row.opsScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <div style={{ width: 40, height: 5, background: '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                        <div style={{ width: `${row.commercialScore}%`, height: '100%', background: RISK_COLORS[getRisk(row.commercialScore)], borderRadius: 200 }} />
                      </div>
                      <span style={{ font: '600 11px/1 var(--font-mono, monospace)', color: RISK_COLORS[getRisk(row.commercialScore)] }}>{row.commercialScore}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      font: '700 11px/1 var(--font-mono, monospace)', color: '#fff',
                      background: RISK_COLORS[risk], padding: '3px 8px', borderRadius: 200,
                    }}>{row.totalScore}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <span style={{
                      background: RISK_BG[risk], color: RISK_COLORS[risk],
                      font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
                      padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize',
                    }}>{risk}</span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {risk === 'high' && (
                      <button style={{
                        border: 0, background: '#4629FF', color: '#fff',
                        font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
                        padding: '5px 10px', borderRadius: 200, cursor: 'pointer',
                      }}>Renegotiate</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Opportunities + Score Trend ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Opportunities */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ font: '700 16px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>SPS Opportunities</div>
              <div style={{ font: '500 12px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg2, marginTop: 2 }}>
                {SPS_OPPORTUNITIES.length} detected · EUR {stats.totalOpportunity.toFixed(0)}K yearly potential
              </div>
            </div>
            <span style={{ background: '#4629FF', color: '#fff', font: '700 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', padding: '4px 10px', borderRadius: 200 }}>
              {SPS_OPPORTUNITIES.filter(o => o.status !== 'Completed').length} active
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflow: 'auto' }}>
            {SPS_OPPORTUNITIES.map((opp, i) => {
              const sc = statusColors[opp.status];
              const tc = typeColors[opp.type];
              return (
                <div key={i} style={{ borderRadius: 10, padding: '14px 16px', border: `1px solid ${opp.status === 'Completed' ? '#E5F5EC' : '#E9EAEC'}`, background: opp.status === 'Completed' ? 'rgba(4,117,56,0.02)' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ font: '600 13px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>{opp.supplier}</span>
                      <span style={{ background: sc.bg, color: sc.fg, font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', padding: '3px 8px', borderRadius: 200 }}>{opp.status}</span>
                    </div>
                    <span style={{ background: tc.bg, color: tc.fg, font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', padding: '3px 8px', borderRadius: 200 }}>{opp.type}</span>
                  </div>
                  <div style={{ font: '500 12px/1.5 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg2, marginBottom: 6 }}>{opp.opportunity}</div>
                  <div style={{ font: '500 11px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: '#4629FF', marginBottom: 8 }}>{opp.action}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ font: '700 13px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: '#D62D0B' }}>EUR {opp.yearlySizing}K / yr</span>
                    {opp.status === 'Not Started' && (
                      <button style={{ border: 0, background: '#4629FF', color: '#fff', font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', padding: '5px 12px', borderRadius: 200, cursor: 'pointer' }}>Start</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score Trend + Methodology */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Score Trend */}
          <div style={card}>
            <div style={{ font: '700 16px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1, marginBottom: 4 }}>SPS Score Trend</div>
            <div style={{ font: '500 12px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg2, marginBottom: 16 }}>Quarterly avg across supplier base</div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SCORE_TREND} barGap={2}>
                  <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: fg3 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: fg3 }} domain={[0, 80]} />
                  <Tooltip contentStyle={{ backgroundColor: '#141415', border: 'none', borderRadius: 8, color: '#fff', fontSize: 11 }} />
                  <Bar dataKey="avgOps" name="Ops" fill="#4629FF" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="avgCommercial" name="Commercial" fill="#047538" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="avgTotal" name="Total" fill="#D62D0B" radius={[3, 3, 0, 0]} />
                  <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '10px', fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Scoring Weights */}
          <div style={card}>
            <div style={{ font: '700 16px/1.4 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1, marginBottom: 16 }}>SPS v1 Scoring Weights</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: '#4629FF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Operations Metrics</div>
              {SCORING_WEIGHTS.ops.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: i % 2 === 0 ? '#F4F5F6' : 'transparent', marginBottom: 2 }}>
                  <span style={{ font: '500 11px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>{w.label}</span>
                  <span style={{ font: '700 11px/1 var(--font-mono, monospace)', color: '#4629FF' }}>{w.weight}%</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ font: '600 10px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: '#047538', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Commercial Metrics</div>
              {SCORING_WEIGHTS.commercial.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: 8, background: i % 2 === 0 ? '#F4F5F6' : 'transparent', marginBottom: 2 }}>
                  <span style={{ font: '500 11px/1 var(--font-sans, ui-sans-serif, system-ui, sans-serif)', color: fg1 }}>{w.label}</span>
                  <span style={{ font: '700 11px/1 var(--font-mono, monospace)', color: '#047538' }}>{w.weight}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
