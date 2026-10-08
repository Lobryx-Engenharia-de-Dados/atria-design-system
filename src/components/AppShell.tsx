import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface AppShellProps {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
  sidebarOpen?: boolean;
  onSidebarClose?: () => void;
  className?: string;
}

export function AppShell({
  sidebar,
  topbar,
  children,
  sidebarOpen = false,
  onSidebarClose,
  className = ''
}: AppShellProps) {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sidebarOpen) sidebarRef.current?.focus();
  }, [sidebarOpen]);

  const handleSidebarKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') onSidebarClose?.();
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground ${className}`}>
      {sidebar && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            className={`fixed inset-0 z-30 bg-primary/40 backdrop-blur-sm lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
            onClick={onSidebarClose}
          />
          <aside
            ref={sidebarRef}
            aria-label="Application navigation"
            aria-hidden="false"
            tabIndex={-1}
            onKeyDown={handleSidebarKeyDown}
            className={`fixed inset-y-0 left-0 z-40 w-72 -translate-x-full transition-transform duration-slow ease-standard lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : ''}`}
          >
            {sidebar}
          </aside>
        </>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {topbar}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
