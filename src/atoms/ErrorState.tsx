import type { ReactNode } from 'react';
import { ErrorAlert } from './ErrorAlert.js';

export interface ErrorStateProps {
  title: ReactNode;
  description?: ReactNode;
  retry?: ReactNode;
  className?: string;
}

export function ErrorState({ title, description, retry, className = '' }: ErrorStateProps) {
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <ErrorAlert>
        <div>
          <h2 className="font-sans text-label font-semibold">{title}</h2>
          {description && <p className="mt-1 text-body">{description}</p>}
        </div>
      </ErrorAlert>
      {retry && <div>{retry}</div>}
    </section>
  );
}
