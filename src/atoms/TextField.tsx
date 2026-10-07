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
      {label && <label className="block text-xs font-black uppercase tracking-widest text-foreground/70 ml-1" htmlFor={fieldId}>{label}</label>}
      <div className="relative group">
        {icon && <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-accent-text transition-colors">{icon}</span>}
        <input
          {...props}
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={ariaDescribedBy}
          className={`w-full bg-surface border-2 rounded-xl pl-12 pr-4 py-3.5 text-sm text-foreground font-medium placeholder:text-foreground-muted/60 focus:outline-none focus:ring-4 transition-all shadow-sm ${error ? 'border-status-error-border focus:border-status-error-border focus:ring-status-error/10' : 'border-border focus:border-accent focus:ring-accent/10'} ${className}`}
        />
      </div>
      {error && <p id={errorId} className="text-[10px] text-status-error font-bold uppercase tracking-tight ml-1" role="alert">{error}</p>}
    </div>
  );
});
