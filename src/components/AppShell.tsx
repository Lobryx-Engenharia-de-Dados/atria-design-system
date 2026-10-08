import { useEffect, useRef, useState, type ReactNode } from 'react';

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

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
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window === 'undefined' || window.matchMedia(DESKTOP_MEDIA_QUERY).matches
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleMediaQueryChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  useEffect(() => {
    if (!sidebarOpen || typeof window === 'undefined') return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onSidebarClose?.();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, onSidebarClose]);

  useEffect(() => {
    if (sidebarOpen) sidebarRef.current?.focus();
  }, [sidebarOpen]);
  const sidebarInert = !isDesktop && !sidebarOpen;

  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground ${className}`}>
      {sidebar && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            className={`fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
            onClick={onSidebarClose}
          />
          <aside
            ref={sidebarRef}
            aria-label="Application navigation"
            {...(sidebarInert ? { 'aria-hidden': true, inert: true, tabIndex: -1 } : {})}
            className={`fixed inset-y-0 left-0 z-50 w-72 -translate-x-full transition-transform duration-slow ease-standard lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : ''}`}
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
