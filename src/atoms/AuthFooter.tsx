import { Fragment, type ReactNode } from 'react';

export interface AuthFooterLink {
  label: ReactNode;
  href: string;
}

export interface AuthFooterProps {
  links?: ReadonlyArray<AuthFooterLink>;
  children?: ReactNode;
}

export function AuthFooter({ links = [], children }: AuthFooterProps) {
  return (
    <div className="pt-8 border-t border-border/50 flex flex-col items-center gap-6">
      {links.length > 0 && (
        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-foreground-muted">
          {links.map((link, index) => (
            <Fragment key={`${link.href}-${index}`}>
              {index > 0 && <span className="w-1 h-1 bg-border rounded-full" aria-hidden="true" />}
              <a
                href={link.href}
                className="hover:text-accent-text transition-colors underline underline-offset-4 decoration-accent/30"
              >
                {link.label}
              </a>
            </Fragment>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
