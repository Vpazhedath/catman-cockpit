'use client';

interface KPICardProps {
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down';
  subtitle?: string;
}

export function KPICard({ label, value, delta, direction, subtitle }: KPICardProps) {
  const isPositive = direction === 'up';
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-dh-blue">{value}</p>
      <p className={`text-sm font-medium mt-1 ${colorClass}`}>{delta}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
      )}
    </div>
  );
}