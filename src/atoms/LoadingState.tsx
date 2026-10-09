import type { ReactNode } from 'react';
import { Skeleton } from './Skeleton.js';

export interface LoadingStateProps {
  message?: ReactNode;
  className?: string;
}

export function LoadingState({ message = 'Carregando…', className = '' }: LoadingStateProps) {
  return (
    <div aria-busy="true" aria-live="polite" className={`flex flex-col gap-3 ${className}`}>
      <span className="sr-only">{message}</span>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
