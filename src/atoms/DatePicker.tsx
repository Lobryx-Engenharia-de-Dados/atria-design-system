import { forwardRef, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { getMonthGrid, positionDateTimePopover } from './DateTimePicker.js';

export interface DatePickerLabels {
  placeholder: string;
  today: string;
  clear: string;
  previousMonth: string;
  nextMonth: string;
  month: string;
  year: string;
  previousYear: string;
  nextYear: string;
}
export interface DatePickerProps {
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
  locale?: string;
  labels: DatePickerLabels;
}
const pad = (number: number) => String(number).padStart(2, '0');
const parseDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day] = [+match[1], +match[2] - 1, +match[3]];
  const date = new Date(year, month, day);
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
    ? { year, month, day }
    : null;
};

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker(
  {
    id, value, onChange, label, required, disabled, error, hint, name,
    className = '', triggerClassName = '', 'aria-describedby': externalDescribedBy, locale = 'pt-BR', labels
  }, forwardedRef
) {
  const generatedId = useId();
  const fieldId = id ?? `date-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const parsed = parseDate(value);
  const [view, setView] = useState(() => {
    const now = new Date();
    return parsed ? new Date(parsed.year, parsed.month, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    if (!open) return;
    const pointerDown = (event: PointerEvent) => {
      if (!popoverRef.current?.contains(event.target as Node) && !triggerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const keyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
      if (event.key === 'Tab' && popoverRef.current) {
        const focusable = Array.from(popoverRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), select:not([disabled])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
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
    document.addEventListener('pointerdown', pointerDown);
    document.addEventListener('keydown', keyDown);
    return () => {
      document.removeEventListener('pointerdown', pointerDown);
      document.removeEventListener('keydown', keyDown);
    };
  }, [open]);
  useEffect(() => {
    if (open) popoverRef.current?.querySelector<HTMLButtonElement>(`[data-day="${parsed?.day ?? 1}"]`)?.focus();
  }, [open]);
  useEffect(() => {
    if (!open || !popoverRef.current || !triggerRef.current) return;
    const update = () => {
      if (!popoverRef.current || !triggerRef.current) return;
      const position = positionDateTimePopover(
        triggerRef.current.getBoundingClientRect(),
        popoverRef.current.getBoundingClientRect(),
        { width: innerWidth, height: innerHeight }
      );
      Object.assign(popoverRef.current.style, {
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${position.width}px`,
        maxHeight: `${position.maxHeight}px`
      });
    };
    update();
    window.addEventListener('scroll', update, { capture: true, passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, view]);

  const selectDay = (day: number) => {
    onChange(`${view.getFullYear()}-${pad(view.getMonth() + 1)}-${pad(day)}`);
    setOpen(false);
  };
  const gridKeyDown = (event: KeyboardEvent<HTMLButtonElement>, day: number) => {
    let delta: number;
    if (event.key === 'ArrowRight') delta = 1;
    else if (event.key === 'ArrowLeft') delta = -1;
    else if (event.key === 'ArrowDown') delta = 7;
    else if (event.key === 'ArrowUp') delta = -7;
    else if (event.key === 'Home') delta = -((new Date(view.getFullYear(), view.getMonth(), day).getDay() + 6) % 7);
    else if (event.key === 'End') delta = 6 - ((new Date(view.getFullYear(), view.getMonth(), day).getDay() + 6) % 7);
    else if (event.key === 'PageDown') {
      event.preventDefault();
      setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
      return;
    } else if (event.key === 'PageUp') {
      event.preventDefault();
      setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
      return;
    } else if (event.key === 'Enter') {
      selectDay(day);
      return;
    } else return;
    event.preventDefault();
    const next = new Date(view.getFullYear(), view.getMonth(), day + delta);
    setView(new Date(next.getFullYear(), next.getMonth(), 1));
  };
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
    .format(new Date(view.getFullYear(), view.getMonth(), 1));
  const monthOptions = Array.from({ length: 12 }, (_, month) => ({
    value: month,
    label: new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, month, 1))
  }));
  const displayValue = parsed
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'short' })
      .format(new Date(parsed.year, parsed.month, parsed.day))
    : labels.placeholder;
  const describedBy = [externalDescribedBy, hint ? `${fieldId}-hint` : '', error ? `${fieldId}-error` : ''].filter(Boolean).join(' ') || undefined;
  const handleTriggerClick = () => {
    if (!open) {
      const current = parseDate(value);
      const now = new Date();
      setView(current
        ? new Date(current.year, current.month, 1)
        : new Date(now.getFullYear(), now.getMonth(), 1));
    }
    setOpen(!open);
  };
  const selectToday = () => {
    const now = new Date();
    onChange(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
    setOpen(false);
  };
  const clear = () => onChange('');
  const setMonth = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setView(new Date(view.getFullYear(), Number(event.currentTarget.value), 1));
  const setYear = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setView(new Date(Number(event.currentTarget.value), view.getMonth(), 1));

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
        onClick={handleTriggerClick}
        className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-left text-foreground focus-visible:outline-2 focus-visible:outline-border-focus ${disabled ? 'opacity-50' : ''} ${triggerClassName}`}
      >{displayValue}</button>
      {hint && <p id={`${fieldId}-hint`} className="text-xs text-foreground-muted">{hint}</p>}
      {error && <p id={`${fieldId}-error`} role="alert" className="text-status-error">{error}</p>}
      {open && <div ref={popoverRef} role="dialog" className="fixed z-50 w-80 overflow-y-auto rounded-lg border border-border bg-surface p-4 text-foreground shadow-card">
      <header className="flex items-center justify-between">
        <button type="button" aria-label={labels.previousYear} onClick={() => setView(new Date(view.getFullYear() - 1, view.getMonth(), 1))}>«</button>
        <button type="button" aria-label={labels.previousMonth} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>‹</button>
        <label className="sr-only" htmlFor={`${fieldId}-month`}>{labels.month}</label>
        <select id={`${fieldId}-month`} aria-label={labels.month} value={view.getMonth()} onChange={setMonth} className="rounded border border-border bg-surface text-foreground">
          {monthOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <label className="sr-only" htmlFor={`${fieldId}-year`}>{labels.year}</label>
        <select id={`${fieldId}-year`} aria-label={labels.year} value={view.getFullYear()} onChange={setYear} className="rounded border border-border bg-surface text-foreground">
          {Array.from({ length: 201 }, (_, index) => 1900 + index).map(year => <option key={year} value={year}>{year}</option>)}
        </select>
        <button type="button" aria-label={labels.nextMonth} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>›</button>
        <button type="button" aria-label={labels.nextYear} onClick={() => setView(new Date(view.getFullYear() + 1, view.getMonth(), 1))}>»</button>
      </header>
      <div role="grid" aria-label={monthName} className="mt-3 grid w-full grid-cols-7 gap-1">
        {Array.from({ length: getMonthGrid(view.getFullYear(), view.getMonth()).length / 7 }, (_, week) => (
          <div role="row" key={week} aria-label={`${labels.month} ${week + 1}`} className="contents">
            {getMonthGrid(view.getFullYear(), view.getMonth()).slice(week * 7, week * 7 + 7).map((date, index) => date
              ? <button
                  key={index}
                  type="button"
                  role="gridcell"
                  data-day={date.getDate()}
                  aria-selected={parsed?.year === date.getFullYear() && parsed.month === date.getMonth() && parsed.day === date.getDate()}
                  onKeyDown={event => gridKeyDown(event, date.getDate())}
                  onClick={() => selectDay(date.getDate())}
                  className={`aspect-square w-full rounded-md text-sm hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-border-focus ${
                    parsed?.year === date.getFullYear() && parsed.month === date.getMonth() && parsed.day === date.getDate()
                      ? 'bg-accent text-accent-foreground font-bold'
                      : date.toDateString() === new Date().toDateString() ? 'ring-1 ring-border-focus' : ''
                  }`}
                >{date.getDate()}</button>
              : <span key={index} role="gridcell" aria-disabled="true" />)}
          </div>
        ))}
      </div>
      <footer className="mt-4 flex justify-between gap-4 border-t border-border pt-4">
        <button type="button" onClick={selectToday}>{labels.today}</button>
        <button type="button" onClick={clear}>{labels.clear}</button>
      </footer>
    </div>}
    </div>
  );
});
