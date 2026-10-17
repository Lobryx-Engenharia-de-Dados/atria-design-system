import { forwardRef, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { positionDateTimePopover } from './DateTimePicker.js';

export interface TimePickerLabels {
  placeholder: string;
  hour: string;
  minute: string;
  clear: string;
}
export interface TimePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  label?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: ReactNode;
  name?: string;
  className?: string;
  triggerClassName?: string;
  'aria-describedby'?: string;
  labels: TimePickerLabels;
}
const pad = (value: number) => String(value).padStart(2, '0');
const clamp = (value: number, max: number) =>
  Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0));
const parse = (value: string) => /^(\d{2}):(\d{2})$/.exec(value);

export const TimePicker = forwardRef<HTMLButtonElement, TimePickerProps>(function TimePicker(
  {
    id, value, onChange, label, required, disabled, error, hint, name, className = '', triggerClassName = '', 'aria-describedby': externalDescribedBy, labels
  }, forwardedRef
) {
  const generatedId = useId();
  const fieldId = id ?? `time-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const matched = parse(value);
  const hour = matched ? Number(matched[1]) : 0;
  const minute = matched ? Number(matched[2]) : 0;
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!popoverRef.current?.contains(event.target as Node) && !triggerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const keys = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
      if (event.key === 'Tab' && popoverRef.current) {
        const controls = Array.from(popoverRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])'));
        const first = controls[0], last = controls.at(-1);
        if (!first || !last) return;
        if (!popoverRef.current.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', keys);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', keys);
    };
  }, [open]);
  useEffect(() => {
    if (open) hourRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!open || !popoverRef.current || !triggerRef.current) return;
    const update = () => {
      if (!popoverRef.current || !triggerRef.current) return;
      const pos = positionDateTimePopover(
        triggerRef.current.getBoundingClientRect(),
        popoverRef.current.getBoundingClientRect(),
        { width: innerWidth, height: innerHeight }
      );
      Object.assign(popoverRef.current.style, {
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        width: `${pos.width}px`,
        maxHeight: `${pos.maxHeight}px`
      });
    };
    update();
    window.addEventListener('scroll', update, { capture: true, passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);
  const update = (part: 'hour' | 'minute', raw: string) => {
    const n = raw === '' ? 0 : Number(raw);
    onChange(
      `${pad(clamp(part === 'hour' ? n : hour, 23))}:${pad(clamp(part === 'minute' ? n : minute, 59))}`
    );
  };
  const display = matched
    ? `${pad(hour)}:${pad(minute)}`
    : labels.placeholder;
  const describedBy = [externalDescribedBy, hint ? `${fieldId}-hint` : '', error ? `${fieldId}-error` : ''].filter(Boolean).join(' ') || undefined;
  const closeAndClear = () => onChange('');
  const setHour = (event: React.ChangeEvent<HTMLInputElement>) => update('hour', event.currentTarget.value);
  const setMinute = (event: React.ChangeEvent<HTMLInputElement>) => update('minute', event.currentTarget.value);
  const toggleOpen = () => setOpen(!open);
  return (
    <div className={`relative space-y-2 ${className}`}>
      {label && <label htmlFor={fieldId} className="block text-xs font-black uppercase tracking-widest text-foreground/70">{label}</label>}
      <input type="hidden" name={name} value={value} />
      <button
        ref={node => {
          triggerRef.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        id={fieldId}
        type="button"
        disabled={disabled}
        aria-required={required}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        onClick={toggleOpen}
        className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-left text-foreground focus-visible:outline-2 focus-visible:outline-border-focus ${disabled ? 'opacity-50' : ''} ${triggerClassName}`}
      >{display}</button>
      {hint && <p id={`${fieldId}-hint`} className="text-xs text-foreground-muted">{hint}</p>}
      {error && <p id={`${fieldId}-error`} role="alert" className="text-status-error">{error}</p>}
      {open && <div ref={popoverRef} role="dialog" className="fixed z-50 w-80 overflow-y-auto rounded-lg border border-border bg-surface p-4 text-foreground shadow-card">
        <div className="flex gap-4">
          <label className="flex-1">
            <span className="block text-xs font-black uppercase tracking-widest text-foreground/70">{labels.hour}</span>
            <input
              ref={hourRef}
              aria-label={labels.hour}
              type="number"
              min="0"
              max="23"
              value={hour}
              onChange={setHour}
              className="w-full rounded border border-border bg-surface px-3 py-2"
            />
          </label>
          <label className="flex-1">
            <span className="block text-xs font-black uppercase tracking-widest text-foreground/70">{labels.minute}</span>
            <input
              aria-label={labels.minute}
              type="number"
              min="0"
              max="59"
              value={minute}
              onChange={setMinute}
              className="w-full rounded border border-border bg-surface px-3 py-2"
            />
          </label>
        </div>
        <footer className="mt-4 flex justify-end gap-4 border-t border-border pt-4">
          <button type="button" onClick={closeAndClear}>{labels.clear}</button>
        </footer>
      </div>}
    </div>
  );
});
