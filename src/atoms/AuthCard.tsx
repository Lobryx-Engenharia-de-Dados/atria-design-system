import type { ReactNode } from 'react';

export interface AuthCardProps {
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({ header, children, footer, className = '' }: AuthCardProps) {
  return (
    <main className={`min-h-screen bg-primary flex flex-col items-center justify-center p-4 text-foreground-on-dark font-sans ${className}`}>
      <div className="max-w-md w-full space-y-8">
        {header}
        <section className="bg-surface/95 backdrop-blur-xl border border-border/20 p-8 rounded-[2rem] space-y-6 shadow-2xl text-foreground">
          {children}
          {footer}
        </section>
      </div>
    </main>
  );
}
