import type { ReactNode } from 'react';

export interface AppSidebarItem {
  label: ReactNode;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

export interface AppSidebarProps {
  brand?: ReactNode;
  groups?: ReactNode;
  items?: AppSidebarItem[];
  footer?: ReactNode;
  className?: string;
}

export function AppSidebar({ brand, groups, items, footer, className = '' }: AppSidebarProps) {
  return (
    <div className={`flex h-full min-h-0 flex-col bg-surface text-foreground ${className}`}>
      {brand && <div className="shrink-0 border-b border-border px-6 py-6">{brand}</div>}
      <nav aria-label="Primary navigation" className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
        {groups}
        {items && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={`relative flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 text-sm font-semibold transition-colors duration-normal ease-standard focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2 ${item.active ? 'border-accent bg-accent/10 text-accent' : 'border-transparent text-foreground-muted hover:bg-primary-light hover:text-foreground'}`}
                >
                  {item.icon && <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">{item.icon}</span>}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
      {footer && <div className="shrink-0 border-t border-border p-4">{footer}</div>}
    </div>
  );
}
