import type { ReactNode } from 'react';

export interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, icon, actions, className = '' }: PageHeaderProps) {
  return (
    <header className={`flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between ${className}`}>
      <div className="min-w-0">
        <div className="flex items-start gap-4">
          {icon && <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-accent">{icon}</div>}
          <div>
            {eyebrow && <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-accent-text">{eyebrow}</p>}
            <h1 className="font-headings text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{title}</h1>
            {subtitle && <p className="mt-3 max-w-2xl text-foreground-muted">{subtitle}</p>}
          </div>
        </div>
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </header>
  );
}
