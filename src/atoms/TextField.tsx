import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  icon?: ReactNode;
  error?: string;
  id?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, icon, error, id, className = '', 'aria-describedby': describedBy, ...props },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? `text-field-${generatedId}`;
  const errorId = `${fieldId}-error`;
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
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={ariaDescribedBy}
          className={`min-h-11 w-full rounded-md border border-border bg-surface-elevated px-3 text-foreground outline-none transition-colors duration-normal ease-standard placeholder:text-foreground-muted focus-visible:border-border-focus focus-visible:ring-2 focus-visible:ring-border-focus/30 ${icon ? 'pl-10' : ''} ${error ? 'border-status-error' : ''} ${className}`}
        />
      </div>
      {error && <p id={errorId} className="text-sm text-status-error" role="alert">{error}</p>}
    </div>
  );
});
