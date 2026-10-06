import type { HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface p-5 text-foreground shadow-card ${className}`}
      {...props}
    />
  );
}
