'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SAMPLE_GMV_TREND } from '@/lib/sample-data';

export function GMVChart() {
  return (
    <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-5">
      <h3 className="text-sm font-medium text-cp-color-text-secondary mb-4">GMV Trend (UAE - Real Data from BigQuery)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SAMPLE_GMV_TREND}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--cp-color-text-secondary)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--cp-color-text-secondary)' }}
              tickFormatter={(value) => `AED ${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value) => {
                if (typeof value === 'number') {
                  return [`AED ${(value / 1000000).toFixed(2)}M`, 'GMV'];
                }
                return [String(value), 'GMV'];
              }}
              contentStyle={{
                backgroundColor: 'var(--cp-color-surface-primary)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--cp-color-text-inverse)',
              }}
            />
            <Bar
              dataKey="value"
              fill="var(--cp-color-surface-brand)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}