import type { ReactNode } from 'react';
import { ErrorAlert } from './ErrorAlert.js';
import { Button } from './Button.js';
import type { StateAction } from './StateAction.js';

export interface ErrorStateProps {
  title: ReactNode;
  description?: ReactNode;
  retry?: StateAction;
  className?: string;
}

export function ErrorState({ title, description, retry, className = '' }: ErrorStateProps) {
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <ErrorAlert>
        <div>
          <h2 className="font-sans text-label font-semibold normal-case tracking-normal">{title}</h2>
          {description && <p className="mt-1 text-body">{description}</p>}
        </div>
      </ErrorAlert>
      {retry && <div><Button href={retry.href} onClick={retry.onClick} disabled={retry.disabled}>{retry.label}</Button></div>}
    </section>
  );
}
