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
  const colorClass = isPositive ? 'text-cp-color-text-success' : 'text-cp-color-text-error';

  return (
    <div className="bg-cp-color-surface-primary border border-cp-color-border-primary rounded-xl p-5">
      <p className="text-sm text-cp-color-text-secondary mb-1">{label}</p>
      <p className="text-2xl font-bold text-cp-color-text-primary">{value}</p>
      <p className={`text-sm font-medium mt-1 ${colorClass}`}>{delta}</p>
      {subtitle && (
        <p className="text-xs text-cp-color-text-tertiary mt-2">{subtitle}</p>
      )}
    </div>
  );
}