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
      {label && <label className="block text-xs font-black uppercase tracking-widest text-foreground/70 ml-1" htmlFor={fieldId}>{label}</label>}
      <div className="relative group">
        {icon && <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted group-focus-within:text-accent-text transition-colors">{icon}</span>}
        <input
          {...props}
          ref={ref}
          id={fieldId}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : props['aria-invalid']}
          aria-describedby={ariaDescribedBy}
          className={`w-full bg-surface border-2 rounded-xl pl-12 pr-10 py-3.5 text-sm text-foreground font-medium placeholder:text-foreground-muted/60 focus:outline-none focus:ring-4 transition-all shadow-sm ${error ? 'border-status-error-border focus:border-status-error-border focus:ring-status-error/10' : 'border-border focus:border-accent focus:ring-accent/10'} ${className}`}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-accent-text focus:outline-none transition-colors"
          aria-label={visible ? hideLabel : showLabel}
          onClick={() => setVisible((current) => !current)}
        >
          <EyeIcon crossed={visible} />
        </button>
      </div>
      {error && <p id={errorId} className="text-[10px] text-status-error font-bold uppercase tracking-tight ml-1" role="alert">{error}</p>}
    </div>
  );
});
