'use client';

import { useMemo, useCallback } from 'react';
import { SAMPLE_SKUS } from '@/lib/sample-data';
import { useTheme } from '@/lib/ThemeContext';
import { exportData, generateFilename, ExportColumn } from '@/lib/export';
import { ExportButton } from '@/components/ExportButton';

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';
const mono = 'var(--font-mono, monospace)';

export default function PricePage() {
  const { theme } = useTheme();
  const t = theme === 'dark';
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const card: React.CSSProperties = { background: t ? '#1E1E20' : '#fff', border: `1px solid ${t ? '#343437' : '#E9EAEC'}`, borderRadius: 12, padding: 20 };

  const allSKUs = useMemo(() => SAMPLE_SKUS.filter(s => s.status === 'active').slice(0, 12), []);

  // Generate stable random-ish competitor prices using a seed based on index
  const priceRows = useMemo(() => {
    return allSKUs.map((sku, i) => {
      // Use deterministic pseudo-random based on index for stable renders
      const seed1 = ((i * 7 + 3) % 20) / 100;
      const seed2 = ((i * 11 + 5) % 15) / 100;
      const seed3 = ((i * 13 + 7) % 25) / 100;
      const cp = (sku.basePrice * (0.85 + seed1)).toFixed(2);
      const lp = (sku.basePrice * (0.88 + seed2)).toFixed(2);
      const np = (sku.basePrice * (0.82 + seed3)).toFixed(2);
      const minComp = Math.min(parseFloat(cp), parseFloat(lp), parseFloat(np));
      const gap = ((sku.basePrice - minComp) / minComp * 100).toFixed(1);
      const isHigh = parseFloat(gap) > 5;
      return { sku, cp, lp, np, gap, isHigh };
    });
  }, [allSKUs]);

  // Export columns for price comparison table
  interface PriceRow {
    sku: { skuId: string; name: string; supplier: string; basePrice: number };
    cp: string;
    lp: string;
    np: string;
    gap: string;
    isHigh: boolean;
  }

  const priceExportColumns: ExportColumn<PriceRow>[] = useMemo(() => [
    { header: 'SKU ID', key: 'sku.skuId' },
    { header: 'SKU Name', key: 'sku.name' },
    { header: 'Supplier', key: 'sku.supplier' },
    { header: 'Our Price', key: 'sku.basePrice', formatter: (val) => Number(val).toFixed(2) },
    { header: 'Carrefour Price', key: 'cp' },
    { header: 'Lulu Price', key: 'lp' },
    { header: 'Noon Price', key: 'np' },
    { header: 'Price Gap %', key: 'gap', formatter: (val, row) => `${(row as PriceRow).isHigh ? '+' : ''}${val}%` },
    { header: 'Above Market', key: 'isHigh', formatter: (val) => val ? 'Yes' : 'No' },
  ], []);

  const handleExport = useCallback((format: 'csv' | 'xlsx') => {
    exportData(priceRows, priceExportColumns, generateFilename('price-comparison'), format);
  }, [priceRows, priceExportColumns]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ font: `700 28px/1.25 ${font}`, letterSpacing: '-0.01em', color: fg1 }}>Affordability</div>
        <div style={{ font: `500 14px/1.5 ${font}`, color: fg2, marginTop: 4 }}>Affordability Engine · Competitor price intelligence</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { l: 'Priced Above Market', v: '14', c: '#D62D0B' },
          { l: 'Avg Price Gap', v: '11.2%', c: '#8F5D00' },
          { l: 'Revenue at Risk', v: 'AED 18K', c: fg1 },
          { l: 'Auto-corrected (7d)', v: '6', c: '#047538' },
        ].map((s, i) => (
          <div key={i} style={{ ...card, padding: '14px 18px' }}>
            <div style={{ font: `500 11px/1 ${font}`, color: fg2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.l}</div>
            <div style={{ font: `700 22px/1.2 ${font}`, color: s.c, marginTop: 6 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ font: `700 16px/1.4 ${font}`, color: fg1 }}>Competitor Price Comparison</div>
          <ExportButton onExport={handleExport} isDark={t} />
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t ? '#343437' : '#F4F5F6' }}>
              {['SKU', 'Our Price', 'Carrefour', 'Lulu', 'Noon', 'Gap', 'Action'].map(h => (
                <th key={h} style={{ textAlign: h === 'Action' ? 'center' : h === 'SKU' ? 'left' : 'right', padding: '10px 14px', font: `600 10px/1 ${font}`, color: fg3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priceRows.map((row) => (
              <tr key={row.sku.skuId} style={{ borderBottom: `1px solid ${t ? '#343437' : '#F4F5F6'}` }}>
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ font: `600 12px/1.3 ${font}`, color: fg1 }}>{row.sku.name}</div>
                  <div style={{ font: `500 10px/1.3 ${font}`, color: fg3 }}>{row.sku.supplier}</div>
                </td>
                <td style={{ padding: '12px 14px', font: `600 12px/1 ${mono}`, color: fg1, textAlign: 'right' }}>{row.sku.basePrice.toFixed(2)}</td>
                <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.cp}</td>
                <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.lp}</td>
                <td style={{ padding: '12px 14px', font: `500 12px/1 ${mono}`, color: fg2, textAlign: 'right' }}>{row.np}</td>
                <td style={{ padding: '12px 14px', font: `600 12px/1 ${mono}`, color: row.isHigh ? '#D62D0B' : '#047538', textAlign: 'right' }}>{row.isHigh ? '+' : ''}{row.gap}%</td>
                <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                  {row.isHigh && <button style={{ border: 0, background: '#4629FF', color: '#fff', font: `600 10px/1 ${font}`, padding: '5px 10px', borderRadius: 200, cursor: 'pointer' }}>Match</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
