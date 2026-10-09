import type { ReactNode } from 'react';
import { Button } from './Button.js';
import type { StateAction } from './StateAction.js';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: StateAction;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <section className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-surface p-8 text-center ${className}`}>
      {icon && <div className="text-foreground-muted" aria-hidden="true">{icon}</div>}
      <h2 className="font-headings text-h3 font-bold text-foreground">{title}</h2>
      {description && <p className="max-w-lg text-body text-foreground-secondary">{description}</p>}
      {action && <div className="mt-2"><Button href={action.href} onClick={action.onClick} disabled={action.disabled}>{action.label}</Button></div>}
    </section>
  );
}
