import type { ReactNode } from 'react';

export interface ErrorAlertProps {
  children: ReactNode;
  className?: string;
}

export function ErrorAlert({ children, className = '' }: ErrorAlertProps) {
  return (
    <div role="alert" className={`bg-status-error-bg border border-status-error-border text-status-error p-4 rounded-xl text-xs flex items-center gap-3 ${className}`}>
      <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
      </svg>
      {children}
    </div>
  );
}
