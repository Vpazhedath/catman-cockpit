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
  Legend,
} from 'recharts';
import { useTheme } from '@/lib/ThemeContext';

// DH Brand Colors
export const DH_COLORS = {
  purple: '#4629FF',
  green: '#A2FAA3',
  red: '#D61F26',
  blue: '#131732',
  gray: '#F5F5F6',
  white: '#FFFFFF',
};

// Chart color palettes
export const LIGHT_PALETTE = {
  primary: DH_COLORS.purple,
  secondary: DH_COLORS.green,
  negative: DH_COLORS.red,
  grid: '#E9EAEC',
  text: '#6C6D73',
  textDark: '#141415',
  background: '#FFFFFF',
  tooltipBg: '#FFFFFF',
  tooltipBorder: '#E9EAEC',
};

export const DARK_PALETTE = {
  primary: DH_COLORS.purple,
  secondary: '#4ADE80',
  negative: '#F87171',
  grid: '#343437',
  text: '#B9BAC1',
  textDark: '#FFFFFF',
  background: '#1E1E20',
  tooltipBg: '#1E1E20',
  tooltipBorder: '#343437',
};

// Chart type variants
export type ChartVariant = 'bar' | 'area' | 'line';

interface BaseChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  height?: number;
  variant?: ChartVariant;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => string;
  xAxisFormatter?: (value: string) => string;
}

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  formatter?: (value: number, name: string) => string;
  isDark: boolean;
}

function CustomTooltip({ active, payload, label, formatter, isDark }: CustomTooltipProps) {
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
            {formatter ? formatter(entry.value, entry.name) : `${entry.value.toLocaleString()}`}
          </span>
        </div>
      ))}
    </div>
  );
}

// GMV Trend Chart Component
interface GMVTrendChartProps {
  data: Array<{ month: string; gmv: number; orders?: number }>;
  height?: number;
  variant?: ChartVariant;
  showOrders?: boolean;
}

export function GMVTrendChart({ data, height = 200, variant = 'bar', showOrders = false }: GMVTrendChartProps) {
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
  const tooltipFormat = (value: number, name: string) => {
    if (name === 'gmv') return `AED ${(value / 1e6).toFixed(2)}M`;
    if (name === 'orders') return value.toLocaleString();
    return value.toLocaleString();
  };

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
              <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.primary} stopOpacity={0.4} />
                <stop offset="100%" stopColor={palette.primary} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
              tickFormatter={(v) => v.split(' ')[0]}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
              tickFormatter={formatGMV}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<CustomTooltip formatter={tooltipFormat} isDark={isDark} />} />
            {showOrders && (
              <Area
                type="monotone"
                dataKey="orders"
                stroke={palette.secondary}
                fill="transparent"
                strokeWidth={2}
                dot={{ fill: palette.secondary, strokeWidth: 0, r: 4 }}
                animationDuration={animationDuration}
              />
            )}
            <Area
              type="monotone"
              dataKey="gmv"
              stroke={palette.primary}
              fill="url(#gmvGradient)"
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
              tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
              tickFormatter={(v) => v.split(' ')[0]}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
              tickFormatter={formatGMV}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<CustomTooltip formatter={tooltipFormat} isDark={isDark} />} />
            {showOrders && (
              <Line
                type="monotone"
                dataKey="orders"
                stroke={palette.secondary}
                strokeWidth={2}
                dot={{ fill: palette.secondary, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: palette.secondary }}
                animationDuration={animationDuration}
              />
            )}
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

      default: // bar
        return (
          <BarChart {...commonProps} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
              tickFormatter={(v) => v.split(' ')[0]}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
              tickFormatter={formatGMV}
              domain={[0, maxValue * 1.1]}
            />
            <Tooltip content={<CustomTooltip formatter={tooltipFormat} isDark={isDark} />} />
            <Bar
              dataKey="gmv"
              fill={palette.primary}
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
              animationDuration={animationDuration}
            />
          </BarChart>
        );
    }
  };

  return (
    <div
      style={{
        height,
        opacity: isAnimated ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

// Status Distribution Chart (Horizontal Bar)
interface StatusDistributionChartProps {
  data: Array<{ label: string; count: number; color: string; pct: number }>;
  height?: number;
}

export function StatusDistributionChart({ data, height = 200 }: StatusDistributionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // Render each bar separately with its own color
  return (
    <div
      style={{
        height,
        opacity: isAnimated ? 1 : 0,
        transition: 'opacity 400ms ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {data.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 70, font: `500 12px/1 ${font}`, color: palette.text, flexShrink: 0 }}>
            {item.label}
          </div>
          <div style={{ flex: 1, height: 20, background: isDark ? '#343437' : '#F4F5F6', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                width: `${item.pct}%`,
                height: '100%',
                background: item.color,
                borderRadius: 4,
                transition: 'width 800ms ease',
              }}
            />
          </div>
          <div style={{ width: 60, font: `600 12px/1 ${font}`, color: palette.textDark, textAlign: 'right' }}>
            {item.count.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

// KPI Sparkline
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({ data, color = DH_COLORS.purple, height = 30, width = 80 }: SparklineProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ height, width }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={`sparkGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sparkGradient-${color.replace('#', '')})`}
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Warehouse Coverage Chart
interface WarehouseChartProps {
  data: Array<{ warehouse: string; inStock: number; outOfStock: number }>;
  height?: number;
}

export function WarehouseChart({ data, height = 180 }: WarehouseChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div
      style={{
        height,
        opacity: isAnimated ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
          <XAxis
            dataKey="warehouse"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: palette.text, fontFamily: font }}
            tickFormatter={(v) => v.split(' ')[0]}
          />
          <YAxis axisLine={false} tickLine={false} hide />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Bar
            dataKey="inStock"
            stackId="a"
            fill={palette.primary}
            radius={[0, 0, 0, 0]}
            animationDuration={800}
          />
          <Bar
            dataKey="outOfStock"
            stackId="a"
            fill={palette.negative}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Performance Trend Chart with dual axes
interface PerformanceTrendChartProps {
  data: Array<{ date: string; gmv?: number; orders?: number; margin?: number }>;
  height?: number;
}

export function PerformanceTrendChart({ data, height = 200 }: PerformanceTrendChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div
      style={{
        height,
        opacity: isAnimated ? 1 : 0,
        transition: 'opacity 400ms ease',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
            tickFormatter={(v) => `AED ${(v / 1e6).toFixed(0)}M`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: palette.text, fontFamily: font }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="gmv"
            stroke={palette.primary}
            strokeWidth={2}
            dot={{ fill: palette.primary, strokeWidth: 0, r: 3 }}
            animationDuration={800}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="margin"
            stroke={palette.secondary}
            strokeWidth={2}
            dot={{ fill: palette.secondary, strokeWidth: 0, r: 3 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GMVTrendChart;