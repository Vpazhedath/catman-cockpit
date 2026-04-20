'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { QuickActions } from '@/components/QuickActions';
import { ExportModal } from '@/components/modals/ExportModal';
import { useNotifications } from '@/lib/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Sample supplier data
const SUPPLIER_SCORECARD = [
  { supplier: 'Almarai', skus: 12, avgMargin: 31, volume: 45000, rating: 'A', trend: 'up', category: 'Dairy', contractEnd: '2026-06-15' },
  { supplier: 'Lacnor', skus: 8, avgMargin: 37, volume: 28000, rating: 'A', trend: 'up', category: 'Juices', contractEnd: '2026-03-20' },
  { supplier: 'Nestle', skus: 15, avgMargin: 28, volume: 52000, rating: 'B', trend: 'stable', category: 'Water', contractEnd: '2026-08-01' },
  { supplier: 'Coca-Cola', skus: 10, avgMargin: 41, volume: 38000, rating: 'A', trend: 'up', category: 'Carbonated', contractEnd: '2027-01-15' },
  { supplier: 'Barakat', skus: 6, avgMargin: 25, volume: 15000, rating: 'B', trend: 'down', category: 'Dairy', contractEnd: '2026-02-28' },
  { supplier: 'Red Bull', skus: 4, avgMargin: 35, volume: 12000, rating: 'A', trend: 'stable', category: 'Energy', contractEnd: '2026-12-01' },
  { supplier: 'PepsiCo', skus: 8, avgMargin: 38, volume: 22000, rating: 'A', trend: 'up', category: 'Carbonated', contractEnd: '2026-09-15' },
  { supplier: 'Nadec', skus: 5, avgMargin: 29, volume: 18000, rating: 'B', trend: 'stable', category: 'Dairy', contractEnd: '2026-05-20' },
];

const MARGINS_BY_CATEGORY = [
  { category: 'Dairy', margin: 32, contribution: 125000, color: '#D61F26' },
  { category: 'Juices', margin: 28, contribution: 45000, color: '#F59E0B' },
  { category: 'Water', margin: 45, contribution: 38000, color: '#3B82F6' },
  { category: 'Carbonated', margin: 41, contribution: 62000, color: '#10B981' },
  { category: 'Energy', margin: 35, contribution: 28000, color: '#8B5CF6' },
];

const MARGIN_TREND = [
  { month: 'Oct', margin: 30.2 },
  { month: 'Nov', margin: 31.5 },
  { month: 'Dec', margin: 32.8 },
  { month: 'Jan', margin: 33.1 },
  { month: 'Feb', margin: 33.8 },
  { month: 'Mar', margin: 34.2 },
];

const RENEGOTIATION_FLAGS = [
  { supplier: 'Nestle', issue: 'Margin below 30%', currentMargin: 28, targetMargin: 32, potentialGain: 'AED 18,400/mo', priority: 'high' },
  { supplier: 'Barakat', issue: 'Declining volume trend', currentMargin: 25, targetMargin: 30, potentialGain: 'AED 7,500/mo', priority: 'medium' },
  { supplier: 'Lacnor', issue: 'Contract renewal due', currentMargin: 37, targetMargin: 40, potentialGain: 'AED 8,400/mo', priority: 'low' },
];

export default function ProfitabilityPage() {
  const [selectedRating, setSelectedRating] = useState<'all' | 'A' | 'B'>('all');
  const [sortBy, setSortBy] = useState<'margin' | 'volume' | 'name'>('margin');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [negotiations, setNegotiations] = useState<string[]>([]);
  const { addNotification } = useNotifications();

  const totalContribution = MARGINS_BY_CATEGORY.reduce((sum, c) => sum + c.contribution, 0);

  const filteredSuppliers = useMemo(() => {
    let data = [...SUPPLIER_SCORECARD];
    if (selectedRating !== 'all') {
      data = data.filter(s => s.rating === selectedRating);
    }
    data.sort((a, b) => {
      if (sortBy === 'margin') return b.avgMargin - a.avgMargin;
      if (sortBy === 'volume') return b.volume - a.volume;
      return a.supplier.localeCompare(b.supplier);
    });
    return data;
  }, [selectedRating, sortBy]);

  const stats = {
    avgMargin: (SUPPLIER_SCORECARD.reduce((sum, s) => sum + s.avgMargin, 0) / SUPPLIER_SCORECARD.length).toFixed(1),
    totalVolume: SUPPLIER_SCORECARD.reduce((sum, s) => sum + s.volume, 0),
    ratingA: SUPPLIER_SCORECARD.filter(s => s.rating === 'A').length,
    ratingB: SUPPLIER_SCORECARD.filter(s => s.rating === 'B').length,
  };

  const handleStartNegotiation = (supplier: string) => {
    setNegotiations([...negotiations, supplier]);
    addNotification({
      type: 'info',
      title: 'Negotiation Started',
      message: `Negotiation process initiated with ${supplier}`,
      actionUrl: '/profitability',
      actionLabel: 'View Progress',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dh-blue">Profitability</h1>
          <p className="text-gray-500 mt-1">Profitability Engine • Supplier margins & negotiation opportunities</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Avg Margin</p>
          <p className="text-2xl font-bold text-dh-blue">{stats.avgMargin}%</p>
          <div className="flex items-center gap-1 mt-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <p className="text-sm text-green-600">+2.1% vs last month</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Total Contribution</p>
          <p className="text-2xl font-bold text-dh-blue">AED {(totalContribution / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Active Suppliers</p>
          <p className="text-2xl font-bold text-dh-blue">{SUPPLIER_SCORECARD.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="text-green-600">{stats.ratingA} A-rated</span> • {stats.ratingB} B-rated
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Renegotiation Ops</p>
          <p className="text-2xl font-bold text-dh-red">{RENEGOTIATION_FLAGS.length}</p>
          <p className="text-sm text-dh-green mt-1">AED 34.3K potential</p>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Margin Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Margin Trend" subtitle="Last 6 months" />
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MARGIN_TREND}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[25, 40]} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Margin']}
                  contentStyle={{ backgroundColor: '#131732', border: 'none', borderRadius: '8px', color: 'white' }}
                />
                <Bar dataKey="margin" fill="#A2FAA3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Contribution by Category */}
        <Card>
          <CardHeader title="Contribution by Category" subtitle="This month" />
          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MARGINS_BY_CATEGORY}
                  dataKey="contribution"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {MARGINS_BY_CATEGORY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {MARGINS_BY_CATEGORY.map(cat => (
              <div key={cat.category} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-gray-600">{cat.category}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Supplier Scorecard */}
      <Card padding="none">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <CardHeader title="Supplier Scorecard" subtitle={`${filteredSuppliers.length} suppliers`} />
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'margin' | 'volume' | 'name')}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
            >
              <option value="margin">Sort by Margin</option>
              <option value="volume">Sort by Volume</option>
              <option value="name">Sort by Name</option>
            </select>
            <div className="flex gap-1">
              {(['all', 'A', 'B'] as const).map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedRating === rating ? 'bg-dh-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {rating === 'all' ? 'All' : `${rating} Rated`}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">SKUs</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Avg Margin</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase">Volume</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Trend</th>
                <th className="text-center px-5 py-3 text-xs font-medium text-gray-500 uppercase">Contract End</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSuppliers.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-medium text-dh-blue">{row.supplier}</td>
                  <td className="px-5 py-3 text-sm text-gray-500">{row.category}</td>
                  <td className="px-5 py-3 text-sm text-center text-gray-600">{row.skus}</td>
                  <td className={`px-5 py-3 text-sm text-right font-medium ${
                    row.avgMargin >= 35 ? 'text-green-600' : row.avgMargin >= 30 ? 'text-dh-blue' : 'text-amber-600'
                  }`}>
                    {row.avgMargin}%
                  </td>
                  <td className="px-5 py-3 text-sm text-right text-gray-600">{row.volume.toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      row.rating === 'A' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.rating}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {row.trend === 'up' ? (
                      <svg className="w-4 h-4 text-green-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : row.trend === 'down' ? (
                      <svg className="w-4 h-4 text-red-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                      </svg>
                    )}
                  </td>
                  <td className="px-5 py-3 text-sm text-center text-gray-500">{row.contractEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Margin by Category & Renegotiation Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Waterfall */}
        <Card>
          <CardHeader title="Margin by Category" subtitle="Contribution breakdown" />
          <div className="space-y-3">
            {MARGINS_BY_CATEGORY.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{cat.category}</div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${cat.margin}%`, backgroundColor: cat.color }}
                    >
                      <span className="text-xs font-medium text-white">{cat.margin}%</span>
                    </div>
                  </div>
                </div>
                <div className="w-24 text-right text-sm text-gray-500">
                  AED {(cat.contribution / 1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Renegotiation Flags */}
        <Card>
          <CardHeader title="Renegotiation Opportunities" subtitle={`${RENEGOTIATION_FLAGS.length} flags from Profitability Engine`} />
          <div className="space-y-3">
            {RENEGOTIATION_FLAGS.map((flag, idx) => (
              <div key={idx} className={`border rounded-lg p-4 ${negotiations.includes(flag.supplier) ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-dh-blue">{flag.supplier}</span>
                      {negotiations.includes(flag.supplier) && (
                        <Badge variant="success">In Progress</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{flag.issue}</p>
                  </div>
                  <Badge variant={flag.priority === 'high' ? 'danger' : flag.priority === 'medium' ? 'warning' : 'info'}>
                    {flag.priority}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Margin: <span className="text-dh-blue font-medium">{flag.currentMargin}%</span> → <span className="text-green-600 font-medium">{flag.targetMargin}%</span>
                  </span>
                  <span className="text-dh-green font-medium">{flag.potentialGain}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    disabled={negotiations.includes(flag.supplier)}
                    onClick={() => handleStartNegotiation(flag.supplier)}
                  >
                    {negotiations.includes(flag.supplier) ? 'Negotiating' : 'Start Negotiation'}
                  </Button>
                  <Button size="sm" variant="ghost">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dataTitle="Profitability & Supplier Data"
      />
    </div>
  );
}