import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  id?: string;
  name?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className = '', 'aria-describedby': describedBy, ...props },
  ref
) {
  const generatedId = useId();
  const fieldId = id ?? `textarea-${generatedId}`;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;
  const ariaDescribedBy = [describedBy, hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-black uppercase tracking-widest text-foreground/70 ml-1" htmlFor={fieldId}>{label}</label>}
      <textarea
        {...props}
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : props['aria-invalid']}
        aria-describedby={ariaDescribedBy}
        className={`w-full bg-surface border-2 rounded-xl px-4 py-3.5 text-sm text-foreground font-medium placeholder:text-foreground-muted/60 focus:outline-none focus:ring-4 transition-all shadow-sm resize-y ${error ? 'border-status-error-border focus:border-status-error-border focus:ring-status-error/10' : 'border-border focus:border-accent focus:ring-accent/10'} ${className}`}
      />
      {hint && <p id={hintId} className="text-xs text-foreground-muted">{hint}</p>}
      {error && <p id={errorId} className="text-[10px] text-status-error font-bold uppercase tracking-tight ml-1" role="alert">{error}</p>}
    </div>
  );
});
