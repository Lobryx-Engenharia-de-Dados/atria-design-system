import type { ReactNode } from 'react';

export interface WordmarkProps {
  name: ReactNode;
  className?: string;
}

export function Wordmark({ name, className }: WordmarkProps) {
  return (
    <span className={`font-headings font-extrabold tracking-tighter whitespace-nowrap ${className}`}>
      {name}<span aria-hidden="true" className="text-accent">.</span>
    </span>
  );
}
