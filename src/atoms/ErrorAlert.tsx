import type { ReactNode } from 'react';

export interface ErrorAlertProps {
  children: ReactNode;
  className?: string;
}

export function ErrorAlert({ children, className = '' }: ErrorAlertProps) {
  return (
    <div role="alert" className={`rounded-md border border-status-error-border bg-status-error-bg p-3 text-sm text-status-error ${className}`}>
      {children}
    </div>
  );
}
