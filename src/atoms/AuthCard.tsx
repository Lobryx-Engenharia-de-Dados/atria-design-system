import type { ReactNode } from 'react';

export interface AuthCardProps {
  brand?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({ brand, title, subtitle, children, footer, className = '' }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <section className={`w-full max-w-md rounded-3xl border border-border/20 bg-surface/95 p-8 text-foreground shadow-panel backdrop-blur-xl md:p-10 ${className}`}>
        <header className="mb-8 text-center">
          {brand && <div className="mb-6 flex justify-center">{brand}</div>}
          <h1 className="font-headings text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-foreground-secondary">{subtitle}</p>}
        </header>
        {children}
        {footer && <footer className="mt-8 text-center text-sm text-foreground-secondary">{footer}</footer>}
      </section>
    </main>
  );
}
