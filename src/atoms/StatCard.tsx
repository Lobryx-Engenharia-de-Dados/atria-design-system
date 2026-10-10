import type { ReactNode } from 'react';
import { Card } from './Card.js';
export interface StatCardProps { label?: ReactNode; title?: ReactNode; value: ReactNode; delta?: ReactNode; secondaryValue?: ReactNode; icon?: ReactNode; className?: string }
export function StatCard({ label, title, value, delta, secondaryValue, icon, className = '' }: StatCardProps) {
  return <Card className={`flex items-center gap-4 ${className}`}>
    {icon && <span className="flex min-h-11 min-w-11 items-center justify-center rounded-md bg-primary-light text-accent-text" aria-hidden="true">{icon}</span>}
    <div><p className="m-0 text-sm font-medium text-foreground-muted">{title ?? label}</p><p className="mt-2 font-headings text-2xl font-bold text-foreground">{value}</p>{(delta ?? secondaryValue) !== undefined && <p className="mt-2 text-sm text-foreground-secondary">{delta ?? secondaryValue}</p>}</div>
  </Card>;
}
