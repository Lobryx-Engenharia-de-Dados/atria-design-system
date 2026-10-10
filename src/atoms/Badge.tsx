import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'outline';
/** @deprecated Use BadgeVariant. Kept for source compatibility. */
export type BadgeStatus = Exclude<BadgeVariant, 'neutral' | 'outline'>;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: ReactNode;
  /** @deprecated Use variant. */
  status?: BadgeStatus;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-border bg-surface-elevated text-foreground',
  success: 'border-status-success-border bg-status-success-bg text-status-success',
  warning: 'border-status-warning-border bg-status-warning-bg text-status-warning',
  error: 'border-status-error-border bg-status-error-bg text-status-error',
  info: 'border-status-info-border bg-status-info-bg text-status-info',
  outline: 'border-border border-dashed bg-transparent text-foreground-muted'
};

export function Badge({ className = '', variant, status, icon, children, ...props }: BadgeProps) {
  const resolvedVariant = variant ?? status ?? 'neutral';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${variantClasses[resolvedVariant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
}
