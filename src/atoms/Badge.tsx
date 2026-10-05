import type { HTMLAttributes } from 'react';

export type BadgeStatus = 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
}

const statusClasses: Record<BadgeStatus, string> = {
  success: 'border-status-success-border bg-status-success-bg text-status-success',
  warning: 'border-status-warning-border bg-status-warning-bg text-status-warning',
  error: 'border-status-error-border bg-status-error-bg text-status-error',
  info: 'border-status-info-border bg-status-info-bg text-status-info'
};

export function Badge({ className = '', status, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]} ${className}`}
      {...props}
    />
  );
}
