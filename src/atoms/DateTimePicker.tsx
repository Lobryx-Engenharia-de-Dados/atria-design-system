import { forwardRef, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface DateTimePickerLabels {
  placeholder: string; today: string; clear: string; previousMonth: string;
  nextMonth: string; hour: string; minute: string;
  previousYear: string; nextYear: string; month: string; year: string;
}
export interface DateTimePickerProps {
  id?: string; value: string; onChange: (value: string) => void; label?: ReactNode;
  min?: string; max?: string;
  required?: boolean; disabled?: boolean; error?: string; hint?: ReactNode;
  name?: string; className?: string; labels: DateTimePickerLabels;
  locale?: string;
  triggerClassName?: string;
  'aria-describedby'?: string;
}
export interface PopoverRect { left: number; top: number; width: number; height: number; maxHeight: number }

export function positionDateTimePopover(
  trigger: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom' | 'width'>,
  popover: Pick<DOMRect, 'width' | 'height'>,
  viewport: { width: number; height: number }, margin = 8
): PopoverRect {
  const width = Math.min(popover.width, Math.max(0, viewport.width - margin * 2));
  const left = Math.min(Math.max(trigger.left, margin), viewport.width - margin - width);
  const below = viewport.height - trigger.bottom - margin;
  const above = trigger.top - margin;
  const flipAbove = popover.height > below && above > below;
  const maxHeight = Math.max(0, Math.min(viewport.height - margin * 2, flipAbove ? Math.max(0, above - margin) : below));
  const height = Math.min(popover.height, maxHeight);
  const top = flipAbove ? trigger.top - margin - height : trigger.bottom;
  return { left, top, width, height, maxHeight };
}

export function getMonthGrid(year: number, month: number): Array<Date | null> {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [...Array<Date | null>(offset).fill(null), ...Array.from(
    { length: count }, (_, index) => new Date(year, month, index + 1)
  )];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
const pad = (number: number) => String(number).padStart(2, '0');
const clamp = (number: number, min: number, max: number) => Math.min(max, Math.max(min, number));
function parseLocal(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  return match ? { year: +match[1], month: +match[2] - 1, day: +match[3], hour: +match[4], minute: +match[5] } : null;
}

export const DateTimePicker = forwardRef<HTMLButtonElement, DateTimePickerProps>(function DateTimePicker(
  { id, value, min, max, onChange, label, required, disabled, error, hint, name, className = '', triggerClassName = '', 'aria-describedby': externalDescribedBy, labels, locale = 'pt-BR' }, forwardedRef
) {
  const generatedId = useId();
  const fieldId = id ?? `datetime-${generatedId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const current = parseLocal(value);
    const now = new Date();
    return current ? new Date(current.year, current.month, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const parsed = parseLocal(value);
  const validBound = (bound?: string) => { const p = bound ? parseLocal(bound) : null; return p && p.hour < 24 && p.minute < 60 && p.month >= 0 && p.month < 12 && p.day >= 1 && p.day <= new Date(p.year, p.month + 1, 0).getDate() ? bound! : ''; };
  const minValue = validBound(min), maxValue = validBound(max);
  const validRange = !(minValue && maxValue && minValue > maxValue);
  const dayDisabled = (date: Date) => { const key = `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`; return Boolean(validRange && ((minValue && key < minValue.slice(0,10)) || (maxValue && key > maxValue.slice(0,10)))); };

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const pointerDown = (event: PointerEvent) => {
      if (!popoverRef.current?.contains(event.target as Node) && !triggerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const keyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
      if (event.key === 'Tab' && popoverRef.current) {
        const focusable = Array.from(popoverRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!popoverRef.current.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    };
    document.addEventListener('pointerdown', pointerDown);
    document.addEventListener('keydown', keyDown);
    return () => {
      document.removeEventListener('pointerdown', pointerDown);
      document.removeEventListener('keydown', keyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const targetDay = parsed?.day ?? 1;
    popoverRef.current?.querySelector<HTMLButtonElement>(`[data-day="${targetDay}"]`)?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || !popoverRef.current || !triggerRef.current) return;
    const updatePosition = () => {
      if (!popoverRef.current || !triggerRef.current) return;
      const anchor = triggerRef.current.getBoundingClientRect();
      const size = popoverRef.current.getBoundingClientRect();
      const position = positionDateTimePopover(anchor, size, { width: innerWidth, height: innerHeight });
      Object.assign(popoverRef.current.style, { left: `${position.left}px`, top: `${position.top}px`, width: `${position.width}px`, maxHeight: `${position.maxHeight}px` });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, { capture: true, passive: true });
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, view]);

  const emit = (year: number, month: number, day: number, hour: number, minute: number) => {
    onChange(`${year}-${pad(month + 1)}-${pad(day)}T${pad(clamp(hour, 0, 23))}:${pad(clamp(minute, 0, 59))}`);
  };
  const selectDay = (day: number) => { if (!dayDisabled(new Date(view.getFullYear(), view.getMonth(), day))) emit(view.getFullYear(), view.getMonth(), day, parsed?.hour ?? 0, parsed?.minute ?? 0); };
  const setTime = (part: 'hour' | 'minute', raw: string) => {
    const base = parsed ?? { year: view.getFullYear(), month: view.getMonth(), day: 1, hour: 0, minute: 0 };
    const amount = raw === '' ? 0 : Number(raw);
    emit(base.year, base.month, base.day, part === 'hour' ? amount : base.hour, part === 'minute' ? amount : base.minute);
  };
  const gridKeyDown = (event: KeyboardEvent<HTMLButtonElement>, day: number) => {
    let delta: number;
    if (event.key === 'ArrowRight') delta = 1;
    else if (event.key === 'ArrowLeft') delta = -1;
    else if (event.key === 'ArrowDown') delta = 7;
    else if (event.key === 'ArrowUp') delta = -7;
    else if (event.key === 'Home') delta = -((new Date(view.getFullYear(), view.getMonth(), day).getDay() + 6) % 7);
    else if (event.key === 'End') delta = 6 - ((new Date(view.getFullYear(), view.getMonth(), day).getDay() + 6) % 7);
    else if (event.key === 'PageDown') { event.preventDefault(); setView(new Date(view.getFullYear(), view.getMonth() + 1, 1)); return; }
    else if (event.key === 'PageUp') { event.preventDefault(); setView(new Date(view.getFullYear(), view.getMonth() - 1, 1)); return; }
    else if (event.key === 'Enter') { selectDay(day); return; }
    else return;
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
    ? new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(
      new Date(parsed.year, parsed.month, parsed.day, parsed.hour, parsed.minute)
    )
    : labels.placeholder;
  const describedBy = [externalDescribedBy, hint ? `${fieldId}-hint` : '', error ? `${fieldId}-error` : ''].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`relative space-y-2 ${className}`}>
      {label && <label htmlFor={fieldId} className="block text-xs font-black uppercase tracking-widest text-foreground/70">{label}</label>}
      <input type="hidden" name={name} value={value} />
      <button ref={(node) => {
        triggerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }} id={fieldId} type="button" disabled={disabled} aria-required={required} aria-haspopup="dialog"
        aria-expanded={open} aria-invalid={!!error} aria-describedby={describedBy}
        onClick={() => {
          if (!open) {
            const current = parseLocal(value); const now = new Date();
            setView(current ? new Date(current.year, current.month, 1) : new Date(now.getFullYear(), now.getMonth(), 1));
          }
          setOpen(!open);
        }}
         className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-left text-foreground focus-visible:outline-2 focus-visible:outline-border-focus ${disabled ? 'opacity-50' : ''} ${triggerClassName}`}>
        {displayValue}
      </button>
      {hint && <p id={`${fieldId}-hint`} className="text-xs text-foreground-muted">{hint}</p>}
      {error && <p id={`${fieldId}-error`} role="alert" className="text-status-error">{error}</p>}
      {open && <div ref={popoverRef} role="dialog" className="fixed z-50 w-80 overflow-y-auto rounded-lg border border-border bg-surface p-4 text-foreground shadow-card">
        <header className="flex items-center justify-between">
          <button type="button" aria-label={labels.previousYear} onClick={() => setView(new Date(view.getFullYear() - 1, view.getMonth(), 1))}>«</button>
          <button type="button" aria-label={labels.previousMonth} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>‹</button>
          <label className="sr-only" htmlFor={`${fieldId}-month`}>{labels.month}</label>
          <select id={`${fieldId}-month`} aria-label={labels.month} value={view.getMonth()}
            onChange={(event) => setView(new Date(view.getFullYear(), Number(event.currentTarget.value), 1))}
            className="rounded border border-border bg-surface text-foreground">
            {monthOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <label className="sr-only" htmlFor={`${fieldId}-year`}>{labels.year}</label>
          <select id={`${fieldId}-year`} aria-label={labels.year} value={view.getFullYear()}
            onChange={(event) => setView(new Date(Number(event.currentTarget.value), view.getMonth(), 1))}
            className="rounded border border-border bg-surface text-foreground">
            {Array.from({ length: 201 }, (_, index) => 1900 + index).map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
          <button type="button" aria-label={labels.nextMonth} onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>›</button>
          <button type="button" aria-label={labels.nextYear} onClick={() => setView(new Date(view.getFullYear() + 1, view.getMonth(), 1))}>»</button>
        </header>
        <div role="grid" aria-label={monthName} className="mt-3 grid w-full grid-cols-7 gap-1">
          {Array.from({ length: getMonthGrid(view.getFullYear(), view.getMonth()).length / 7 }, (_, week) => (
            <div role="row" key={week} className="contents">
              {getMonthGrid(view.getFullYear(), view.getMonth()).slice(week * 7, week * 7 + 7).map((date, index) => date
                ? <button key={index} type="button" role="gridcell" data-day={date.getDate()} aria-disabled={dayDisabled(date) ? 'true' : undefined}
                    aria-selected={parsed?.year === date.getFullYear() && parsed.month === date.getMonth() && parsed.day === date.getDate()}
                    onKeyDown={(event) => gridKeyDown(event, date.getDate())} onClick={() => selectDay(date.getDate())}
                    className={`aspect-square w-full rounded-md text-sm hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-border-focus ${dayDisabled(date) ? 'opacity-40 cursor-not-allowed' : ''} ${parsed?.year === date.getFullYear() && parsed.month === date.getMonth() && parsed.day === date.getDate() ? 'bg-accent text-accent-foreground font-bold' : date.toDateString() === new Date().toDateString() ? 'ring-1 ring-border-focus' : ''}`}>{date.getDate()}</button>
                : <span key={index} role="gridcell" aria-disabled="true" />)}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <label className="flex-1"><span className="block text-xs font-black uppercase tracking-widest text-foreground/70">{labels.hour}</span><input aria-label={labels.hour} type="number" min="0" max="23" value={parsed?.hour ?? 0}
            onChange={(event) => setTime('hour', event.currentTarget.value)} className="w-full rounded border border-border bg-surface px-3 py-2" /></label>
          <label className="flex-1"><span className="block text-xs font-black uppercase tracking-widest text-foreground/70">{labels.minute}</span><input aria-label={labels.minute} type="number" min="0" max="59" value={parsed?.minute ?? 0}
            onChange={(event) => setTime('minute', event.currentTarget.value)} className="w-full rounded border border-border bg-surface px-3 py-2" /></label>
        </div>
        <footer className="mt-4 flex justify-between gap-4 border-t border-border pt-4">
          <button type="button" disabled={dayDisabled(new Date())} onClick={() => { const now = new Date(); if (!dayDisabled(now)) emit(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()); }}>{labels.today}</button>
          <button type="button" onClick={() => onChange('')}>{labels.clear}</button>
        </footer>
      </div>}
    </div>
  );
});
