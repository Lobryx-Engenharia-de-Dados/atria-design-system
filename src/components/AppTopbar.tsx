import type { ReactNode } from 'react';

export interface AppTopbarProps {
  title?: ReactNode;
  actions?: ReactNode;
  user?: ReactNode;
  themeToggle?: ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

export function AppTopbar({ title, actions, user, themeToggle, onMenuClick, className = '' }: AppTopbarProps) {
  return (
    <header className={`sticky top-0 z-20 flex min-h-16 items-center gap-4 border-b border-border bg-surface/95 px-6 py-3 backdrop-blur ${className}`}>
      <button
        type="button"
        aria-label="Open navigation"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2 lg:hidden"
        onClick={onMenuClick}
      >
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {title && <div className="min-w-0 flex-1 truncate font-headings text-lg font-bold text-foreground">{title}</div>}
      <div className="ml-auto flex items-center gap-3">
        {actions}
        {themeToggle}
        {user}
      </div>
    </header>
  );
}
