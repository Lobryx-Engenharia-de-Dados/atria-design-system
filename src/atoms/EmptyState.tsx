import type { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <section className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface p-8 text-center ${className}`}>
      {icon && <div className="text-foreground-muted" aria-hidden="true">{icon}</div>}
      <h2 className="font-headings text-h3 font-bold text-foreground">{title}</h2>
      {description && <p className="max-w-lg text-body text-foreground-secondary">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </section>
  );
}
