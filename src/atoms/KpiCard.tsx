import type { ReactNode } from 'react';
import { Card } from './Card.js';

export interface KpiCardProps {
  label: string;
  value: ReactNode;
  delta?: ReactNode;
  className?: string;
}

export function KpiCard({ label, value, delta, className = '' }: KpiCardProps) {
  return (
    <Card className={className}>
      <p className="m-0 text-sm font-medium text-foreground-muted">{label}</p>
      <p className="mt-2 font-headings text-2xl font-bold text-foreground">{value}</p>
      {delta !== undefined && <p className="mt-2 text-sm text-foreground-secondary">{delta}</p>}
    </Card>
  );
}
