'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { SAMPLE_GMV_TREND } from '@/lib/sample-data';
import { useTheme } from '@/lib/ThemeContext';
import { ChartVariant, LIGHT_PALETTE, DARK_PALETTE } from './Charts';

interface GMVChartProps {
  data?: Array<{ month: string; gmv: number; orders?: number }>;
  height?: number;
  variant?: ChartVariant;
}

// Inline custom tooltip for GMVChart
function GMVTooltip({ active, payload, label, isDark }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string; isDark: boolean }) {
  if (!active || !payload || payload.length === 0) return null;

  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

  return (
    <div
      style={{
        background: palette.tooltipBg,
        border: `1px solid ${palette.tooltipBorder}`,
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        font: `500 12px/1.4 ${font}`,
      }}
    >
      <div style={{ color: palette.text, marginBottom: 6 }}>{label}</div>
      {payload.map((entry, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: entry.color,
            }}
          />
          <span style={{ color: palette.textDark }}>
            {entry.name === 'gmv' ? `AED ${(entry.value / 1e6).toFixed(2)}M` : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// Legacy component for backward compatibility
export function GMVChart({ data = SAMPLE_GMV_TREND, height = 256, variant = 'bar' }: GMVChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const maxValue = Math.max(...data.map(d => d.gmv));

  const formatGMV = (value: number) => `AED ${(value / 1e6).toFixed(1)}M`;

  const animationDuration = 800;

  const commonProps = {
    data,
    margin: { top: 10, right: 10, left: 0, bottom: 0 },
  };

  const renderChart = () => {
    switch (variant) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="gmvGradientLegacy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.primary} stopOpacity={0.4} />
                <stop offset="100%" stopColor={palette.primary} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: palette.text, fontFamily: font }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: palette.text, fontFamily: font }}
              tickFormatter={formatGMV}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<GMVTooltip isDark={isDark} />} />
            <Area
              type="monotone"
              dataKey="gmv"
              stroke={palette.primary}
              fill="url(#gmvGradientLegacy)"
              strokeWidth={2}
              dot={{ fill: palette.primary, strokeWidth: 0, r: 4 }}
              animationDuration={animationDuration}
            />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: palette.text, fontFamily: font }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: palette.text, fontFamily: font }}
              tickFormatter={formatGMV}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<GMVTooltip isDark={isDark} />} />
            <Line
              type="monotone"
              dataKey="gmv"
              stroke={palette.primary}
              strokeWidth={2}
              dot={{ fill: palette.primary, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: palette.primary }}
              animationDuration={animationDuration}
            />
          </LineChart>
        );

      default:
        return (
          <BarChart {...commonProps} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: palette.text, fontFamily: font }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: palette.text, fontFamily: font }}
              tickFormatter={formatGMV}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<GMVTooltip isDark={isDark} />} />
            <Bar
              dataKey="gmv"
              fill={palette.primary}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
              animationDuration={animationDuration}
            />
          </BarChart>
        );
    }
  };

  return (
    <div
      className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-5"
      style={{
        height,
        opacity: isAnimated ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
    >
      <h3 className="text-sm font-medium text-cp-color-text-secondary mb-4">
        GMV Trend (UAE - Real Data from BigQuery)
      </h3>
      <div style={{ height: height - 60 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GMVChart;