'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantStyles = {
  default: 'bg-cp-color-surface-secondary text-cp-color-text-primary',
  success: 'bg-cp-color-surface-success-subtle text-cp-color-text-success',
  warning: 'bg-cp-color-surface-warning-subtle text-cp-color-text-warning',
  danger: 'bg-cp-color-surface-error-subtle text-cp-color-text-error',
  info: 'bg-cp-color-surface-information-subtle text-cp-color-text-information',
  purple: 'bg-cp-color-surface-brand-subtle text-cp-color-text-brand',
};

const sizeStyles = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function Badge({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
}

// Status badge specifically for SKU status (from DMart Lifecycle Strategy)
interface StatusBadgeProps {
  status: 'active' | 'on-hold' | 'discontinued' | 'retired';
}

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const },
  'on-hold': { label: 'On-Hold', variant: 'warning' as const },
  discontinued: { label: 'Discontinued', variant: 'danger' as const },
  retired: { label: 'Retired', variant: 'default' as const },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}

// Maturity Stage badge (from DMart Lifecycle Strategy)
interface MaturityBadgeProps {
  stage: 'new' | 'probation' | 'mature' | 'review' | 'phase-out';
}

const maturityConfig = {
  new: { label: 'New', variant: 'info' as const },
  probation: { label: 'Probation', variant: 'purple' as const },
  mature: { label: 'Mature', variant: 'success' as const },
  review: { label: 'Review', variant: 'warning' as const },
  'phase-out': { label: 'Phase-out', variant: 'danger' as const },
};

export function MaturityBadge({ stage }: MaturityBadgeProps) {
  const config = maturityConfig[stage];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}

// Efficiency badge (from DMart Lifecycle Strategy)
interface EfficiencyBadgeProps {
  efficiency: 'efficient' | 'slow-mover' | 'zero-mover' | 'low-availability';
}

const efficiencyConfig = {
  efficient: { label: 'Efficient', variant: 'success' as const },
  'slow-mover': { label: 'Slow Mover', variant: 'warning' as const },
  'zero-mover': { label: 'Zero Mover', variant: 'danger' as const },
  'low-availability': { label: 'Low Availability', variant: 'warning' as const },
};

export function EfficiencyBadge({ efficiency }: EfficiencyBadgeProps) {
  const config = efficiencyConfig[efficiency];
  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
}