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
  onNavigate?: () => void;
}

export function getAppSidebarItemClassNames(active: boolean) {
  return {
    link: `group relative flex items-center gap-3 rounded-xl border-l-4 px-4 py-3 text-sm font-semibold transition-colors duration-normal ease-standard focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2 ${active ? 'border-accent bg-accent/10 text-foreground' : 'border-transparent text-foreground-muted hover:bg-primary-light hover:text-foreground'}`,
    icon: `flex h-[18px] w-[18px] shrink-0 items-center justify-center ${active ? 'text-accent-text' : 'text-foreground-muted group-hover:text-accent-text'}`,
  };
}

export function AppSidebar({ brand, groups, items, footer, className = '', onNavigate }: AppSidebarProps) {
  return (
    <div className={`flex h-full min-h-0 flex-col border-r border-border bg-surface text-foreground ${className}`}>
      {brand && <div className="shrink-0 border-b border-border px-6 py-6">{brand}</div>}
      <nav aria-label="Primary navigation" className="min-h-0 flex-1 overflow-y-auto px-3 py-6">
        {groups}
        {items && (
          <ul className="space-y-2">
            {items.map((item) => {
              const classes = getAppSidebarItemClassNames(Boolean(item.active));
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={item.active ? 'page' : undefined}
                    className={classes.link}
                  >
                    {item.icon && <span className={classes.icon}>{item.icon}</span>}
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
      {footer && <div className="shrink-0 border-t border-border p-4">{footer}</div>}
    </div>
  );
}
