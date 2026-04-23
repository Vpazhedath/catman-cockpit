'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuickActions } from '@/components/QuickActions';
import { ExportModal } from '@/components/modals/ExportModal';
import { useNotifications } from '@/lib/NotificationContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, ZAxis, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

// ─── SPS Segmentation Tiers ──────────────────────────────
type Segment = 'Key Accounts' | 'Standard' | 'Niche' | 'Long Tail';

const SEGMENT_COLORS: Record<Segment, string> = {
  'Key Accounts': '#4629FF',
  'Standard': '#D61F26',
  'Niche': '#F59E0B',
  'Long Tail': '#10B981',
};

const SEGMENT_DESCRIPTIONS: Record<Segment, string> = {
  'Key Accounts': 'Drive majority of business value and are essential to our customers',
  'Standard': 'Contribute to bottom line, but less to basket and assortment',
  'Niche': 'Highly penetrated but low contribution to overall sales',
  'Long Tail': 'Supplement assortment but less critical to value proposition',
};

// ─── SPS Supplier Data (Step 1 Segmentation + Step 2 Scoring) ─────────
interface SPSSupplier {
  supplier: string;
  segment: Segment;
  category: string;
  // Segmentation metrics (Step 1)
  netRetailProfit: number; // $ thousands
  abvOrder: number;
  customerFrequency: number;
  customerPenetration: number;
  importanceScore: number; // 0-100
  productivityScore: number; // 0-100
  // Scoring metrics (Step 2)
  fillRate: number;
  otd: number; // On Time Delivery %
  yoyGpvGrowth: number;
  efficiency: number;
  promoGpvContr: number;
  frontMargin: number;
  backMargin: number;
  // Computed scores
  opsScore: number;
  commercialScore: number;
  totalScore: number;
  // Perception metrics
  gpv: number; // $ thousands
  gpvShare: number;
  cogs: number; // $ thousands
  supplierFunding: number; // $ thousands
  totalMargin: number;
  availability: number;
  skuCount: number;
  isVMI: boolean;
}

const SPS_SUPPLIERS: SPSSupplier[] = [
  {
    supplier: 'Almarai', segment: 'Key Accounts', category: 'Dairy',
    netRetailProfit: 285, abvOrder: 18.5, customerFrequency: 2.4, customerPenetration: 31.2,
    importanceScore: 95, productivityScore: 72,
    fillRate: 88.5, otd: 82.1, yoyGpvGrowth: 14.2, efficiency: 78.3, promoGpvContr: 12.8, frontMargin: 28.4, backMargin: 4.2,
    opsScore: 72, commercialScore: 58, totalScore: 65,
    gpv: 892, gpvShare: 18.2, cogs: 641, supplierFunding: 8.5, totalMargin: 32.6, availability: 94.1, skuCount: 42, isVMI: true,
  },
  {
    supplier: 'Nestle', segment: 'Key Accounts', category: 'Beverages',
    netRetailProfit: 198, abvOrder: 15.2, customerFrequency: 2.1, customerPenetration: 28.6,
    importanceScore: 82, productivityScore: 65,
    fillRate: 75.5, otd: 66.7, yoyGpvGrowth: 20.0, efficiency: 56.0, promoGpvContr: 12.8, frontMargin: 17.0, backMargin: 5.0,
    opsScore: 49, commercialScore: 38, totalScore: 44,
    gpv: 624, gpvShare: 12.8, cogs: 518, supplierFunding: 3.2, totalMargin: 22.0, availability: 85.7, skuCount: 35, isVMI: false,
  },
  {
    supplier: 'Coca-Cola', segment: 'Key Accounts', category: 'Beverages',
    netRetailProfit: 165, abvOrder: 14.8, customerFrequency: 1.9, customerPenetration: 25.4,
    importanceScore: 78, productivityScore: 58,
    fillRate: 91.6, otd: 39.2, yoyGpvGrowth: 37.1, efficiency: 73.2, promoGpvContr: 6.2, frontMargin: 21.1, backMargin: 3.4,
    opsScore: 71, commercialScore: 36, totalScore: 54,
    gpv: 520, gpvShare: 10.6, cogs: 410, supplierFunding: 4.8, totalMargin: 24.5, availability: 82.5, skuCount: 18, isVMI: true,
  },
  {
    supplier: 'PepsiCo', segment: 'Key Accounts', category: 'Beverages',
    netRetailProfit: 142, abvOrder: 13.5, customerFrequency: 1.8, customerPenetration: 22.8,
    importanceScore: 72, productivityScore: 55,
    fillRate: 78.1, otd: 63.0, yoyGpvGrowth: 20.0, efficiency: 64.0, promoGpvContr: 9.0, frontMargin: 23.0, backMargin: 0.0,
    opsScore: 62, commercialScore: 29, totalScore: 46,
    gpv: 448, gpvShare: 9.2, cogs: 345, supplierFunding: 2.3, totalMargin: 23.0, availability: 78.0, skuCount: 22, isVMI: false,
  },
  {
    supplier: 'GTRC Mars', segment: 'Key Accounts', category: 'Confectionery',
    netRetailProfit: 57, abvOrder: 11.0, customerFrequency: 1.86, customerPenetration: 22.6,
    importanceScore: 100, productivityScore: 47,
    fillRate: 56.0, otd: 19.0, yoyGpvGrowth: 20.0, efficiency: 64.0, promoGpvContr: 9.0, frontMargin: 22.3, backMargin: 0.0,
    opsScore: 41, commercialScore: 24, totalScore: 33,
    gpv: 148, gpvShare: 13.0, cogs: 116, supplierFunding: 2.3, totalMargin: 23.3, availability: 74.4, skuCount: 15, isVMI: false,
  },
  {
    supplier: 'Fergulf', segment: 'Key Accounts', category: 'Confectionery',
    netRetailProfit: 125, abvOrder: 16.2, customerFrequency: 2.0, customerPenetration: 24.1,
    importanceScore: 85, productivityScore: 62,
    fillRate: 72.0, otd: 48.0, yoyGpvGrowth: 38.0, efficiency: 87.0, promoGpvContr: 17.0, frontMargin: 23.0, backMargin: 2.0,
    opsScore: 62, commercialScore: 46, totalScore: 54,
    gpv: 188, gpvShare: 17.0, cogs: 145, supplierFunding: 0, totalMargin: 24.5, availability: 72.7, skuCount: 12, isVMI: false,
  },
  {
    supplier: 'Red Bull', segment: 'Standard', category: 'Beverages',
    netRetailProfit: 68, abvOrder: 9.2, customerFrequency: 1.3, customerPenetration: 12.8,
    importanceScore: 55, productivityScore: 28,
    fillRate: 82.0, otd: 75.0, yoyGpvGrowth: 5.8, efficiency: 85.0, promoGpvContr: 8.5, frontMargin: 35.0, backMargin: 3.5,
    opsScore: 59, commercialScore: 52, totalScore: 56,
    gpv: 180, gpvShare: 3.7, cogs: 117, supplierFunding: 1.2, totalMargin: 38.5, availability: 97.0, skuCount: 4, isVMI: false,
  },
  {
    supplier: 'Lacnor', segment: 'Standard', category: 'Beverages',
    netRetailProfit: 52, abvOrder: 8.4, customerFrequency: 1.5, customerPenetration: 14.2,
    importanceScore: 48, productivityScore: 32,
    fillRate: 79.8, otd: 90.0, yoyGpvGrowth: 18.3, efficiency: 65.0, promoGpvContr: 29.3, frontMargin: 17.1, backMargin: 4.7,
    opsScore: 84, commercialScore: 48, totalScore: 66,
    gpv: 109, gpvShare: 2.2, cogs: 76, supplierFunding: 0.5, totalMargin: 30.7, availability: 78.0, skuCount: 8, isVMI: false,
  },
  {
    supplier: 'Nadec', segment: 'Standard', category: 'Dairy',
    netRetailProfit: 45, abvOrder: 7.8, customerFrequency: 1.4, customerPenetration: 11.5,
    importanceScore: 42, productivityScore: 25,
    fillRate: 85.0, otd: 70.0, yoyGpvGrowth: 8.2, efficiency: 72.0, promoGpvContr: 15.0, frontMargin: 29.0, backMargin: 2.5,
    opsScore: 59, commercialScore: 44, totalScore: 52,
    gpv: 145, gpvShare: 3.0, cogs: 103, supplierFunding: 0.8, totalMargin: 31.5, availability: 88.0, skuCount: 12, isVMI: false,
  },
  {
    supplier: 'Barakat', segment: 'Standard', category: 'Dairy',
    netRetailProfit: 38, abvOrder: 6.5, customerFrequency: 1.2, customerPenetration: 9.8,
    importanceScore: 45, productivityScore: 18,
    fillRate: 62.1, otd: 66.7, yoyGpvGrowth: -1.1, efficiency: 70.3, promoGpvContr: 0.4, frontMargin: 30.0, backMargin: 0.8,
    opsScore: 64, commercialScore: 25, totalScore: 45,
    gpv: 77, gpvShare: 1.6, cogs: 54, supplierFunding: 0.1, totalMargin: 30.7, availability: 78.0, skuCount: 6, isVMI: false,
  },
  {
    supplier: 'Mondelez', segment: 'Niche', category: 'Confectionery',
    netRetailProfit: 22, abvOrder: 12.0, customerFrequency: 1.6, customerPenetration: 18.5,
    importanceScore: 28, productivityScore: 48,
    fillRate: 70.0, otd: 55.0, yoyGpvGrowth: 12.0, efficiency: 60.0, promoGpvContr: 22.0, frontMargin: 25.0, backMargin: 3.0,
    opsScore: 44, commercialScore: 42, totalScore: 43,
    gpv: 85, gpvShare: 1.7, cogs: 64, supplierFunding: 1.0, totalMargin: 28.0, availability: 82.0, skuCount: 8, isVMI: false,
  },
  {
    supplier: 'Ferrero', segment: 'Niche', category: 'Confectionery',
    netRetailProfit: 18, abvOrder: 14.5, customerFrequency: 1.1, customerPenetration: 16.2,
    importanceScore: 22, productivityScore: 45,
    fillRate: 65.0, otd: 50.0, yoyGpvGrowth: 8.0, efficiency: 55.0, promoGpvContr: 18.0, frontMargin: 30.0, backMargin: 1.5,
    opsScore: 39, commercialScore: 38, totalScore: 39,
    gpv: 62, gpvShare: 1.3, cogs: 43, supplierFunding: 0.5, totalMargin: 31.5, availability: 76.0, skuCount: 5, isVMI: false,
  },
  {
    supplier: 'Gulf Resources', segment: 'Long Tail', category: 'Grocery',
    netRetailProfit: 8, abvOrder: 5.2, customerFrequency: 0.8, customerPenetration: 4.5,
    importanceScore: 12, productivityScore: 12,
    fillRate: 45.0, otd: 35.0, yoyGpvGrowth: -5.0, efficiency: 40.0, promoGpvContr: 2.0, frontMargin: 18.0, backMargin: 0.0,
    opsScore: 27, commercialScore: 15, totalScore: 21,
    gpv: 28, gpvShare: 0.6, cogs: 23, supplierFunding: 0, totalMargin: 18.0, availability: 61.0, skuCount: 18, isVMI: false,
  },
  {
    supplier: 'Food Stores General', segment: 'Long Tail', category: 'Grocery',
    netRetailProfit: 5, abvOrder: 4.8, customerFrequency: 0.7, customerPenetration: 3.2,
    importanceScore: 8, productivityScore: 8,
    fillRate: 20.0, otd: 29.0, yoyGpvGrowth: -10.0, efficiency: 51.0, promoGpvContr: 1.0, frontMargin: 35.0, backMargin: 4.0,
    opsScore: 23, commercialScore: 24, totalScore: 24,
    gpv: 58, gpvShare: 5.0, cogs: 38, supplierFunding: 0, totalMargin: 39.2, availability: 61.1, skuCount: 25, isVMI: false,
  },
];

// ─── Segment Summary ──────────────────────────────────────
const SEGMENT_SUMMARY = [
  { segment: 'Key Accounts' as Segment, supplierCount: 6, gpv: 2820, gpvShare: 70, netProfit: 972, profitShare: 65 },
  { segment: 'Standard' as Segment, supplierCount: 4, gpv: 511, gpvShare: 18, netProfit: 203, profitShare: 22 },
  { segment: 'Niche' as Segment, supplierCount: 2, gpv: 147, gpvShare: 2, netProfit: 40, profitShare: 3 },
  { segment: 'Long Tail' as Segment, supplierCount: 2, gpv: 86, gpvShare: 9, netProfit: 13, profitShare: 11 },
];

// ─── SPS Scoring Trend ────────────────────────────────────
const SCORE_TREND = [
  { quarter: 'Q1 \'25', avgOps: 48.2, avgCommercial: 32.5, avgTotal: 40.4 },
  { quarter: 'Q2 \'25', avgOps: 50.8, avgCommercial: 34.1, avgTotal: 42.5 },
  { quarter: 'Q3 \'25', avgOps: 53.1, avgCommercial: 35.8, avgTotal: 44.5 },
  { quarter: 'Q4 \'25', avgOps: 55.6, avgCommercial: 37.2, avgTotal: 46.4 },
  { quarter: 'Q1 \'26', avgOps: 56.8, avgCommercial: 38.9, avgTotal: 47.9 },
];

// ─── SPS Opportunities ───────────────────────────────────
interface SPSOpportunity {
  supplier: string;
  segment: Segment;
  opportunity: string;
  blindSpot: string;
  action: string;
  yearlySizing: number; // EUR thousands
  status: 'Completed' | 'In Progress' | 'Not Started';
  type: 'Margin Expansion' | 'Growth Opportunity';
}

const SPS_OPPORTUNITIES: SPSOpportunity[] = [
  {
    supplier: 'GTRC Mars', segment: 'Key Accounts',
    opportunity: 'No Back Margin agreement — affecting Total Margin',
    blindSpot: 'Check for funding from Prio 2 rebates or ad-hoc NMR',
    action: 'Negotiate at least 1% BM% to achieve parity with category leader',
    yearlySizing: 8.0, status: 'In Progress', type: 'Margin Expansion',
  },
  {
    supplier: 'GTRC Mars', segment: 'Key Accounts',
    opportunity: 'Lowest Fill Rate (56%) & OTD (19%) among confectionery',
    blindSpot: 'Check availability level focused on top seller products',
    action: 'Aim to achieve similar Fill Rate as Fergulf ~72%',
    yearlySizing: 44.0, status: 'Not Started', type: 'Growth Opportunity',
  },
  {
    supplier: 'PepsiCo', segment: 'Key Accounts',
    opportunity: 'No Back Margin agreement despite high GPV share',
    blindSpot: 'Check for contractual NMR not captured in Auto Rebate Calculator',
    action: 'Negotiate warehouse allowance rebate to cover delivery costs',
    yearlySizing: 4.1, status: 'Completed', type: 'Margin Expansion',
  },
  {
    supplier: 'PepsiCo', segment: 'Key Accounts',
    opportunity: 'Minimal promo contribution vs. category leader',
    blindSpot: 'Compare promo calendar with Coca-Cola campaigns',
    action: 'Secure monthly promotions for 7 key SKUs',
    yearlySizing: 10.6, status: 'Completed', type: 'Growth Opportunity',
  },
  {
    supplier: 'Barakat', segment: 'Standard',
    opportunity: 'GPV YoY decline (-1.1%) with low promo contribution (0.4%)',
    blindSpot: 'Review if decline is seasonal or systemic',
    action: 'Negotiate contractual NMR to push sales and increase overall margin',
    yearlySizing: 12.5, status: 'In Progress', type: 'Growth Opportunity',
  },
  {
    supplier: 'Nestle', segment: 'Key Accounts',
    opportunity: 'Front Margin at 17% — well below category average of 24%',
    blindSpot: 'Review COGS against competitor pricing to validate margin gap',
    action: 'Renegotiate cost price to align FM% with category benchmark',
    yearlySizing: 18.4, status: 'Not Started', type: 'Margin Expansion',
  },
];

// ─── Scoring Weights (from SPS methodology) ──────────────
const SCORING_WEIGHTS = {
  ops: { fillRate: 60, otd: 40 },
  commercial: { efficiency: 30, promoGpvContr: 20, yoyGpvGrowth: 10, frontMargin: 15, backMargin: 25 },
};

// ─── Tooltip Formatters ──────────────────────────────────
const darkTooltipStyle = { backgroundColor: '#131732', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px' };

export default function ProfitabilityPage() {
  const [selectedSegment, setSelectedSegment] = useState<'all' | Segment>('all');
  const [sortBy, setSortBy] = useState<'totalScore' | 'opsScore' | 'commercialScore' | 'gpv'>('totalScore');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [negotiations, setNegotiations] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'segmentation' | 'scoring'>('segmentation');
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const filteredSuppliers = useMemo(() => {
    let data = [...SPS_SUPPLIERS];
    if (selectedSegment !== 'all') {
      data = data.filter(s => s.segment === selectedSegment);
    }
    data.sort((a, b) => {
      if (sortBy === 'totalScore') return b.totalScore - a.totalScore;
      if (sortBy === 'opsScore') return b.opsScore - a.opsScore;
      if (sortBy === 'commercialScore') return b.commercialScore - a.commercialScore;
      return b.gpv - a.gpv;
    });
    return data;
  }, [selectedSegment, sortBy]);

  const stats = useMemo(() => {
    const all = SPS_SUPPLIERS;
    return {
      avgTotal: (all.reduce((s, x) => s + x.totalScore, 0) / all.length).toFixed(1),
      avgOps: (all.reduce((s, x) => s + x.opsScore, 0) / all.length).toFixed(1),
      avgCommercial: (all.reduce((s, x) => s + x.commercialScore, 0) / all.length).toFixed(1),
      totalGPV: all.reduce((s, x) => s + x.gpv, 0),
      totalOpportunity: SPS_OPPORTUNITIES.reduce((s, x) => s + x.yearlySizing, 0),
      completedOps: SPS_OPPORTUNITIES.filter(o => o.status === 'Completed').length,
      inProgressOps: SPS_OPPORTUNITIES.filter(o => o.status === 'In Progress').length,
    };
  }, []);

  // Segmentation scatter data
  const segmentationData = SPS_SUPPLIERS.map(s => ({
    x: s.productivityScore,
    y: s.importanceScore,
    z: s.gpv,
    name: s.supplier,
    segment: s.segment,
    fill: SEGMENT_COLORS[s.segment],
  }));

  // Scoring quadrant data
  const scoringData = SPS_SUPPLIERS.map(s => ({
    x: s.commercialScore,
    y: s.opsScore,
    z: s.gpv,
    name: s.supplier,
    segment: s.segment,
    fill: SEGMENT_COLORS[s.segment],
  }));

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

  const handleStartNegotiation = (supplier: string) => {
    setNegotiations([...negotiations, supplier]);
    addNotification({
      type: 'info',
      title: 'Negotiation Initiated',
      message: `SPS-driven negotiation started with ${supplier}`,
      actionUrl: '/profitability',
      actionLabel: 'Track Progress',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cp-color-text-primary">Supplier Performance Scorecard</h1>
          <p className="text-cp-color-text-secondary mt-1">Profitability Engine • SPS v1 — Segmentation, Scoring & Opportunity Detection</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportOpen(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <QuickActions />
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card variant="outlined" className="p-4">
          <p className="text-xs text-cp-color-text-secondary font-medium uppercase tracking-wide">Avg Total Score</p>
          <p className="text-2xl font-bold text-cp-color-text-primary mt-1">{stats.avgTotal}</p>
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-3.5 h-3.5 text-cp-color-text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            <p className="text-xs text-cp-color-text-success">+3.4 vs Q4</p>
          </div>
        </Card>
        <Card variant="outlined" className="p-4">
          <p className="text-xs text-cp-color-text-secondary font-medium uppercase tracking-wide">Ops Score</p>
          <p className="text-2xl font-bold text-cp-color-text-primary mt-1">{stats.avgOps}</p>
          <p className="text-xs text-cp-color-text-secondary mt-1">Fill Rate + OTD weighted</p>
        </Card>
        <Card variant="outlined" className="p-4">
          <p className="text-xs text-cp-color-text-secondary font-medium uppercase tracking-wide">Commercial Score</p>
          <p className="text-2xl font-bold text-cp-color-text-primary mt-1">{stats.avgCommercial}</p>
          <p className="text-xs text-cp-color-text-secondary mt-1">FM + BM + Efficiency</p>
        </Card>
        <Card variant="outlined" className="p-4">
          <p className="text-xs text-cp-color-text-secondary font-medium uppercase tracking-wide">Total GPV</p>
          <p className="text-2xl font-bold text-cp-color-text-primary mt-1">AED {(stats.totalGPV / 1000).toFixed(1)}M</p>
          <p className="text-xs text-cp-color-text-secondary mt-1">{SPS_SUPPLIERS.length} suppliers scored</p>
        </Card>
        <Card variant="outlined" className="p-4">
          <p className="text-xs text-cp-color-text-secondary font-medium uppercase tracking-wide">Opportunities</p>
          <p className="text-2xl font-bold text-dh-red mt-1">EUR {stats.totalOpportunity.toFixed(0)}K</p>
          <p className="text-xs text-cp-color-text-success mt-1">{stats.completedOps} completed • {stats.inProgressOps} in progress</p>
        </Card>
      </div>

      {/* Segmentation / Scoring Toggle + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('segmentation')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeView === 'segmentation' ? 'bg-dh-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Segmentation
              </button>
              <button
                onClick={() => setActiveView('scoring')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeView === 'scoring' ? 'bg-dh-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Scoring Quadrant
              </button>
            </div>
            <div className="flex items-center gap-3">
              {Object.entries(SEGMENT_COLORS).map(([seg, color]) => (
                <div key={seg} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-500">{seg}</span>
                </div>
              ))}
            </div>
          </div>

          {activeView === 'segmentation' ? (
            <div>
              <p className="text-xs text-cp-color-text-secondary mb-2">
                Supplier Importance (Y) vs Supplier Productivity (X) — bubble size = GPV
              </p>
              <div className="h-80 relative">
                {/* Cutoff lines */}
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" dataKey="x" name="Productivity" domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false}
                      label={{ value: 'Supplier Productivity & Importance to Customers', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#6b7280' }}
                    />
                    <YAxis type="number" dataKey="y" name="Importance" domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false}
                      label={{ value: 'Importance to Business', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: '#6b7280' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[80, 600]} />
                    <Tooltip
                      contentStyle={darkTooltipStyle}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''}
                    />
                    {/* Cutoff reference lines via cartesianGrid areas */}
                    <Scatter data={segmentationData}>
                      {segmentationData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.fill} fillOpacity={0.75} stroke={entry.fill} strokeWidth={1} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                {/* Cutoff labels */}
                <div className="absolute left-[48%] top-0 bottom-0 border-l border-dashed border-red-300" />
                <div className="absolute left-0 right-0 top-[55%] border-t border-dashed border-red-300" />
                <span className="absolute left-[49%] top-1 text-[10px] text-red-400 font-medium">Cut-off: 40</span>
                <span className="absolute right-2 top-[56%] text-[10px] text-red-400 font-medium">Cut-off: 15</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-cp-color-text-secondary mb-2">
                Ops Score (Y) vs Commercial Score (X) — identify Leverage/Expand vs Monitor/Replace
              </p>
              <div className="h-80 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" dataKey="x" name="Commercial" domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false}
                      label={{ value: 'Commercial Score', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#6b7280' }}
                    />
                    <YAxis type="number" dataKey="y" name="Operations" domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false}
                      label={{ value: 'Ops Score', angle: -90, position: 'insideLeft', offset: 5, fontSize: 11, fill: '#6b7280' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[80, 600]} />
                    <Tooltip
                      contentStyle={darkTooltipStyle}
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''}
                    />
                    <Scatter data={scoringData}>
                      {scoringData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.fill} fillOpacity={0.75} stroke={entry.fill} strokeWidth={1} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                {/* Quadrant labels */}
                <div className="absolute left-[48%] top-0 bottom-0 border-l border-dashed border-gray-300" />
                <div className="absolute left-0 right-0 top-[50%] border-t border-dashed border-gray-300" />
                <span className="absolute left-[14%] top-[20%] text-[10px] text-gray-400 font-medium bg-white px-1 rounded">Develop Commercials</span>
                <span className="absolute right-[14%] top-[20%] text-[10px] text-dh-purple font-semibold bg-white px-1 rounded">Leverage / Expand</span>
                <span className="absolute left-[14%] bottom-[18%] text-[10px] text-gray-400 font-medium bg-white px-1 rounded">Monitor / Replace</span>
                <span className="absolute right-[14%] bottom-[18%] text-[10px] text-gray-400 font-medium bg-white px-1 rounded">Improve Service Level</span>
              </div>
            </div>
          )}
        </Card>

        {/* Right panel: Segment breakdown or Radar */}
        <Card>
          {selectedSupplier && radarData.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <CardHeader title={selectedSupplier} subtitle="SPS Metric Breakdown" />
                <button onClick={() => setSelectedSupplier(null)} className="text-xs text-gray-400 hover:text-gray-600">Clear</button>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius={80}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar name={selectedSupplier} dataKey="value" stroke="#4629FF" fill="#4629FF" fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              {(() => {
                const s = SPS_SUPPLIERS.find(x => x.supplier === selectedSupplier)!;
                return (
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-500">Ops Score</span>
                      <span className="block font-bold text-dh-blue text-lg">{s.opsScore}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-500">Commercial</span>
                      <span className="block font-bold text-dh-blue text-lg">{s.commercialScore}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-500">Fill Rate</span>
                      <span className="block font-semibold">{s.fillRate}%</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-gray-500">Back Margin</span>
                      <span className={`block font-semibold ${s.backMargin === 0 ? 'text-dh-red' : ''}`}>{s.backMargin}%</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div>
              <CardHeader title="Segment Breakdown" subtitle="GPV & profit distribution" />
              <div className="space-y-3">
                {SEGMENT_SUMMARY.map(seg => (
                  <div
                    key={seg.segment}
                    className={`border rounded-lg p-3 cursor-pointer transition hover:shadow-sm ${selectedSegment === seg.segment ? 'border-dh-purple bg-purple-50' : 'border-gray-100'}`}
                    onClick={() => setSelectedSegment(selectedSegment === seg.segment ? 'all' : seg.segment)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[seg.segment] }} />
                        <span className="text-sm font-medium text-dh-blue">{seg.segment}</span>
                      </div>
                      <span className="text-xs text-gray-400">{seg.supplierCount} suppliers</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">GPV Share</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${seg.gpvShare}%`, backgroundColor: SEGMENT_COLORS[seg.segment] }} />
                          </div>
                          <span className="font-medium">{seg.gpvShare}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Profit Share</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-dh-green" style={{ width: `${seg.profitShare}%` }} />
                          </div>
                          <span className="font-medium">{seg.profitShare}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Score Trend */}
      <Card>
        <CardHeader title="SPS Score Trend" subtitle="Quarterly average scores across supplier base" />
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SCORE_TREND} barGap={2}>
              <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} domain={[0, 100]} />
              <Tooltip contentStyle={darkTooltipStyle} />
              <Bar dataKey="avgOps" name="Ops Score" fill="#4629FF" radius={[3, 3, 0, 0]} />
              <Bar dataKey="avgCommercial" name="Commercial Score" fill="#A2FAA3" radius={[3, 3, 0, 0]} />
              <Bar dataKey="avgTotal" name="Total Score" fill="#D61F26" radius={[3, 3, 0, 0]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Supplier Scorecard Table */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <CardHeader title="Supplier Performance Scorecard" subtitle={`${filteredSuppliers.length} suppliers • Click row for radar detail`} />
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
            >
              <option value="totalScore">Sort by Total Score</option>
              <option value="opsScore">Sort by Ops Score</option>
              <option value="commercialScore">Sort by Commercial Score</option>
              <option value="gpv">Sort by GPV</option>
            </select>
            <div className="flex gap-1">
              {(['all', 'Key Accounts', 'Standard', 'Niche', 'Long Tail'] as const).map(seg => (
                <button
                  key={seg}
                  onClick={() => setSelectedSegment(seg)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    selectedSegment === seg ? 'bg-dh-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {seg === 'all' ? 'All' : seg}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase" rowSpan={2}>Supplier</th>
                <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-gray-500 uppercase" rowSpan={2}>Segment</th>
                <th className="text-center px-3 py-1.5 text-[10px] font-semibold text-dh-blue uppercase border-b border-gray-200" colSpan={2}>Ops Metrics</th>
                <th className="text-center px-3 py-1.5 text-[10px] font-semibold text-dh-blue uppercase border-b border-gray-200" colSpan={5}>Commercial Metrics</th>
                <th className="text-center px-3 py-1.5 text-[10px] font-semibold text-dh-red uppercase border-b border-gray-200" colSpan={3}>Scores</th>
                <th className="text-center px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase border-b border-gray-200" colSpan={2}>Perception</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">Fill Rate</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">OTD</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">YoY GPV</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">Efficiency</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">Promo %</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">FM %</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">BM %</th>
                <th className="px-3 py-1.5 text-[10px] text-dh-blue font-semibold text-center">Ops</th>
                <th className="px-3 py-1.5 text-[10px] text-dh-blue font-semibold text-center">Comm.</th>
                <th className="px-3 py-1.5 text-[10px] text-dh-red font-bold text-center">Total</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">GPV (K)</th>
                <th className="px-3 py-1.5 text-[10px] text-gray-400 font-medium text-center">Total Mgn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSuppliers.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-blue-50/30 cursor-pointer transition ${selectedSupplier === row.supplier ? 'bg-purple-50/40' : ''}`}
                  onClick={() => setSelectedSupplier(selectedSupplier === row.supplier ? null : row.supplier)}
                >
                  <td className="px-4 py-2.5 text-sm font-medium text-dh-blue">{row.supplier}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{
                      backgroundColor: `${SEGMENT_COLORS[row.segment]}15`,
                      color: SEGMENT_COLORS[row.segment],
                    }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SEGMENT_COLORS[row.segment] }} />
                      {row.segment}
                    </span>
                  </td>
                  <td className={`px-3 py-2.5 text-xs text-center font-medium ${row.fillRate >= 80 ? 'text-green-600' : row.fillRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {row.fillRate}%
                  </td>
                  <td className={`px-3 py-2.5 text-xs text-center font-medium ${row.otd >= 70 ? 'text-green-600' : row.otd >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                    {row.otd}%
                  </td>
                  <td className={`px-3 py-2.5 text-xs text-center ${row.yoyGpvGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.yoyGpvGrowth > 0 ? '+' : ''}{row.yoyGpvGrowth}%
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center text-gray-600">{row.efficiency}%</td>
                  <td className="px-3 py-2.5 text-xs text-center text-gray-600">{row.promoGpvContr}%</td>
                  <td className="px-3 py-2.5 text-xs text-center text-gray-600">{row.frontMargin}%</td>
                  <td className={`px-3 py-2.5 text-xs text-center font-medium ${row.backMargin === 0 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                    {row.backMargin === 0 ? (
                      <span className="inline-flex items-center gap-0.5">
                        0%
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : `${row.backMargin}%`}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      row.opsScore >= 60 ? 'bg-green-100 text-green-700' : row.opsScore >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>{row.opsScore}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      row.commercialScore >= 50 ? 'bg-green-100 text-green-700' : row.commercialScore >= 30 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>{row.commercialScore}</span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                      row.totalScore >= 55 ? 'bg-green-600 text-white' : row.totalScore >= 40 ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
                    }`}>{row.totalScore}</span>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center text-gray-600">{row.gpv}</td>
                  <td className={`px-3 py-2.5 text-xs text-center font-medium ${row.totalMargin >= 30 ? 'text-green-600' : 'text-amber-600'}`}>
                    {row.totalMargin}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Opportunity Detection & Negotiation Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Opportunities */}
        <Card>
          <CardHeader
            title="SPS Opportunity Detection"
            subtitle={`${SPS_OPPORTUNITIES.length} opportunities • EUR ${stats.totalOpportunity.toFixed(0)}K yearly potential`}
          />
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {SPS_OPPORTUNITIES.map((opp, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${
                  opp.status === 'Completed' ? 'border-green-200 bg-green-50/50' :
                  opp.status === 'In Progress' ? 'border-amber-200 bg-amber-50/50' :
                  'border-gray-200 bg-gray-50/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-dh-blue">{opp.supplier}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{
                      backgroundColor: `${SEGMENT_COLORS[opp.segment]}15`,
                      color: SEGMENT_COLORS[opp.segment],
                    }}>{opp.segment}</span>
                    {opp.status === 'Completed' && <Badge variant="success" size="sm">Completed</Badge>}
                    {opp.status === 'In Progress' && <Badge variant="warning" size="sm">In Progress</Badge>}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    opp.type === 'Margin Expansion' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>{opp.type}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex gap-2">
                    <span className="shrink-0">
                      <svg className="w-3.5 h-3.5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    </span>
                    <span className="text-gray-700">{opp.opportunity}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0">
                      <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                    </span>
                    <span className="text-gray-500">{opp.blindSpot}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0">
                      <svg className="w-3.5 h-3.5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </span>
                    <span className="text-gray-700 font-medium">{opp.action}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-dh-red">EUR {opp.yearlySizing}K / yr</span>
                  {opp.status === 'Not Started' && (
                    <Button
                      size="sm"
                      disabled={negotiations.includes(opp.supplier + opp.opportunity)}
                      onClick={(e) => { e.stopPropagation(); handleStartNegotiation(opp.supplier); }}
                    >
                      Start Negotiation
                    </Button>
                  )}
                  {opp.status === 'In Progress' && (
                    <Button size="sm" variant="outline">Track Progress</Button>
                  )}
                  {opp.status === 'Completed' && (
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Negotiated
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* SPS Scoring Methodology + Profit Sizing */}
        <div className="space-y-6">
          {/* Profit Sizing Waterfall */}
          <Card>
            <CardHeader title="Profit Uplift Sizing" subtitle="Yearly estimation by opportunity type" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 font-medium">Margin Expansion</p>
                <p className="text-xl font-bold text-blue-700">
                  EUR {SPS_OPPORTUNITIES.filter(o => o.type === 'Margin Expansion').reduce((s, o) => s + o.yearlySizing, 0).toFixed(1)}K
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <p className="text-xs text-purple-600 font-medium">Growth Opportunity</p>
                <p className="text-xl font-bold text-purple-700">
                  EUR {SPS_OPPORTUNITIES.filter(o => o.type === 'Growth Opportunity').reduce((s, o) => s + o.yearlySizing, 0).toFixed(1)}K
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {['Completed', 'In Progress', 'Not Started'].map(status => {
                const ops = SPS_OPPORTUNITIES.filter(o => o.status === status);
                const total = ops.reduce((s, o) => s + o.yearlySizing, 0);
                const pct = (total / stats.totalOpportunity) * 100;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-gray-600">{status}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: status === 'Completed' ? '#10B981' : status === 'In Progress' ? '#F59E0B' : '#D1D5DB',
                        }}
                      >
                        <span className="text-[10px] font-medium text-white">{total.toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SPS Methodology Reference */}
          <Card>
            <CardHeader title="SPS v1 Scoring Weights" subtitle="Methodology reference" />
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-dh-blue mb-2 uppercase tracking-wide">Operations Metrics</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SCORING_WEIGHTS.ops).map(([key, weight]) => (
                    <div key={key} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-700 capitalize">{key === 'fillRate' ? 'Fill Rate %' : 'On Time Delivery %'}</span>
                      <span className="text-xs font-bold text-dh-blue">{weight}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-dh-blue mb-2 uppercase tracking-wide">Commercial Metrics</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SCORING_WEIGHTS.commercial).map(([key, weight]) => {
                    const labels: Record<string, string> = {
                      efficiency: 'Efficiency %',
                      promoGpvContr: 'Promo GPV Contr. %',
                      yoyGpvGrowth: 'YoY GPV Growth %',
                      frontMargin: 'Front Margin %',
                      backMargin: 'Back Margin %',
                    };
                    return (
                      <div key={key} className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-700">{labels[key]}</span>
                        <span className="text-xs font-bold text-green-700">{weight}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dataTitle="Supplier Performance Scorecard Data"
      />
    </div>
  );
}
