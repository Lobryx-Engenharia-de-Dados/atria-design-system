import type { HTMLAttributes, ReactNode } from 'react';
export type AlertTone = 'neutral' | 'success' | 'warning' | 'error' | 'info';
export interface AlertProps extends HTMLAttributes<HTMLDivElement> { tone?: AlertTone; children: ReactNode }
const toneClasses: Record<AlertTone, string> = { neutral: 'border-border bg-surface-elevated text-foreground', success: 'border-status-success-border bg-status-success-bg text-status-success', warning: 'border-status-warning-border bg-status-warning-bg text-status-warning', error: 'border-status-error-border bg-status-error-bg text-status-error', info: 'border-status-info-border bg-status-info-bg text-status-info' };
export function Alert({ tone = 'info', className = '', children, ...props }: AlertProps) { return <div role="status" className={`rounded-md border p-4 ${toneClasses[tone]} ${className}`} {...props}>{children}</div>; }
