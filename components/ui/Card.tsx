'use client';

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'outlined' | 'filled' | 'elevated';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
};

const variantStyles = {
  outlined: 'border border-cp-color-border-primary',
  filled: 'bg-cp-color-surface-secondary',
  elevated: 'shadow-lg',
};

export function Card({ children, className = '', padding = 'md', variant = 'outlined' }: CardProps) {
  return (
    <div className={`bg-cp-color-surface-primary rounded-xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-medium text-cp-color-text-secondary">{title}</h3>
        {subtitle && <p className="text-xs text-cp-color-text-tertiary mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}