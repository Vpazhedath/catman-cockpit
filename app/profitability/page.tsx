'use client';

import { useMemo, useCallback } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { exportData, generateFilename, ExportColumn } from '@/lib/export';
import { ExportButton } from '@/components/ExportButton';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';

interface Supplier {
  name: string;
  skus: number;
  avgMargin: number;
  totalGMV: string;
  score: number;
  risk: 'low' | 'medium' | 'high';
}

const suppliers: Supplier[] = [
  { name: 'PepsiCo', skus: 4, avgMargin: 30, totalGMV: 'AED 420K', score: 88, risk: 'low' },
  { name: 'Almarai', skus: 5, avgMargin: 30, totalGMV: 'AED 380K', score: 92, risk: 'low' },
  { name: 'Mondelez', skus: 1, avgMargin: 30, totalGMV: 'AED 180K', score: 85, risk: 'low' },
  { name: 'Nestle', skus: 1, avgMargin: 30, totalGMV: 'AED 160K', score: 90, risk: 'low' },
  { name: 'Red Bull', skus: 1, avgMargin: 30, totalGMV: 'AED 145K', score: 78, risk: 'medium' },
  { name: 'Blue Diamond', skus: 1, avgMargin: 30, totalGMV: 'AED 12K', score: 52, risk: 'high' },
  { name: 'Spanish Saffron Co', skus: 1, avgMargin: 30, totalGMV: 'AED 8K', score: 45, risk: 'high' },
  { name: 'Local Foods LLC', skus: 1, avgMargin: 30, totalGMV: 'AED 2K', score: 22, risk: 'high' },
];

const riskColors: Record<string, string> = { low: '#047538', medium: '#8F5D00', high: '#D62D0B' };
const riskBg: Record<string, string> = { low: '#E5F5EC', medium: '#FFF8DF', high: '#FCEBE8' };

export default function ProfitabilityPage() {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const card: React.CSSProperties = { background: t ? '#1E1E20' : '#fff', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 12, padding: 20 };

  // Export columns for supplier scorecard
  const supplierExportColumns: ExportColumn<Supplier>[] = useMemo(() => [
    { header: 'Supplier', key: 'name' },
    { header: 'SKUs', key: 'skus' },
    { header: 'Avg Margin %', key: 'avgMargin', formatter: (val) => `${val}%` },
    { header: 'Total GMV', key: 'totalGMV' },
    { header: 'Score', key: 'score' },
    { header: 'Risk Level', key: 'risk', formatter: (val) => String(val).toUpperCase() },
  ], []);

  const handleExport = useCallback((format: 'csv' | 'xlsx') => {
    exportData(suppliers, supplierExportColumns, generateFilename('supplier-scorecard'), format);
  }, [supplierExportColumns]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Profitability</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Profitability Engine · Supplier scorecard & margin optimization</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Avg Supplier Score', v: '76/100', c: '#4629FF' },
          { l: 'Below Threshold', v: '3', c: '#D62D0B' },
          { l: 'Renegotiation Opp.', v: 'AED 32K', c: '#047538' },
          { l: 'Active Suppliers', v: '8', c: fg1 },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.c, marginTop: 6 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>Supplier Scorecard</div>
          <ExportButton onExport={handleExport} isDark={t} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t ? '#343437' : '#F4F5F6' }}>
              {['Supplier', 'SKUs', 'Avg Margin', 'GMV', 'Score', 'Risk', 'Action'].map(h => (
                <th key={h} style={{ textAlign: h === 'Supplier' ? 'left' : h === 'Action' ? 'center' : 'right', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliers.map((sup, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${t ? '#343437' : '#F4F5F6'}` }}>
                <td style={{ padding: '12px 14px', font: `600 13px/1 ${font}`, color: fg1 }}>{sup.name}</td>
                <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{sup.skus}</td>
                <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{sup.avgMargin}%</td>
                <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{sup.totalGMV}</td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                    <div style={{ width: 48, height: 5, background: t ? '#343437' : '#F4F5F6', borderRadius: 200, overflow: 'hidden' }}>
                      <div style={{ width: `${sup.score}%`, height: '100%', background: riskColors[sup.risk], borderRadius: 200 }} />
                    </div>
                    <span style={{ font: `600 11px/1 ${mono}`, color: riskColors[sup.risk] }}>{sup.score}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                  <span style={{ background: t ? `${riskColors[sup.risk]}18` : riskBg[sup.risk], color: riskColors[sup.risk], font: `600 10px/1 ${font}`, padding: '4px 8px', borderRadius: 200, textTransform: 'capitalize' }}>{sup.risk}</span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  {sup.risk === 'high' && <button style={{ border: 0, background: '#4629FF', color: '#fff', font: `600 10px/1 ${font}`, padding: '5px 10px', borderRadius: 200, cursor: 'pointer' }}>Renegotiate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
