'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SAMPLE_GMV_TREND } from '@/lib/sample-data';

export function GMVChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-4">GMV Trend (7 days)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SAMPLE_GMV_TREND}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              formatter={(value: number) => [`AED ${value.toLocaleString()}`, 'GMV']}
              contentStyle={{
                backgroundColor: '#131732',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Bar
              dataKey="value"
              fill="#D61F26"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}