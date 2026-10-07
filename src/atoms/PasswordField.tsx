import { forwardRef, useId, useState } from 'react';
import type { TextFieldProps } from './TextField.js';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  showLabel: string;
  hideLabel: string;
}

function EyeIcon({ crossed = false }: { crossed?: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6-9.75-6-9.75-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      {crossed && <path strokeLinecap="round" d="m4 4 16 16" />}
    </svg>
  );
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
  { label, icon, error, id, className = '', showLabel, hideLabel, 'aria-describedby': describedBy, ...props },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? `password-field-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const [visible, setVisible] = useState(false);
  const ariaDescribedBy = [describedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary" htmlFor={fieldId}>{label}</label>}
      <div className="relative">
        {icon && <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground-muted">{icon}</span>}
        <input
          {...props}
          ref={ref}
          id={fieldId}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={ariaDescribedBy}
          className={`min-h-11 w-full rounded-md border border-border bg-surface-elevated px-3 pr-11 text-foreground outline-none transition-colors duration-normal ease-standard placeholder:text-foreground-muted focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus/30 ${icon ? 'pl-10' : ''} ${error ? 'border-status-error' : ''} ${className}`}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-foreground-muted transition-colors duration-fast hover:text-foreground focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-[-2px]"
          aria-label={visible ? hideLabel : showLabel}
          onClick={() => setVisible((current) => !current)}
        >
          <EyeIcon crossed={visible} />
        </button>
      </div>
      {error && <p id={errorId} className="text-sm text-status-error" role="alert">{error}</p>}
    </div>
  );
});
