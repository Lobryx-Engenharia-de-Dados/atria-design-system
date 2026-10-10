import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from 'react';

export interface SelectOption { value: string; label: ReactNode; disabled?: boolean }
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: ReactNode;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ label, error, options, children, id, className = '', ...props }, ref) {
  const generatedId = useId();
  const selectId = id ?? `select-${generatedId}`;
  const errorId = `${selectId}-error`;
  return <div className="space-y-2">
    {label && <label htmlFor={selectId} className="block text-xs font-black uppercase tracking-widest text-foreground/70">{label}</label>}
    <select {...props} ref={ref} id={selectId} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={error ? errorId : props['aria-describedby']} className={`min-h-11 w-full rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-border-focus ${className}`}>
      {options?.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      {children}
    </select>
    {error && <p id={errorId} role="alert" className="text-xs text-status-error">{error}</p>}
  </div>;
});
