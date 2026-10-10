import { useEffect, useId, useRef, type ReactNode } from 'react';

type ModalStackEntry = object;

const openModalStack: ModalStackEntry[] = [];

const removeFromModalStack = (entry: ModalStackEntry) => {
  const index = openModalStack.indexOf(entry);
  if (index !== -1) openModalStack.splice(index, 1);
};

export interface ModalProps { isOpen: boolean; title: ReactNode; subtitle?: ReactNode; icon?: ReactNode; onClose: () => void; children: ReactNode; size?: 'sm' | 'md' | 'lg' }
export function Modal({ isOpen, title, subtitle, icon, onClose, children, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${useId()}`;
  const descId = `modal-description-${useId()}`;
  useEffect(() => {
    if (!isOpen) return;
    const stackEntry: ModalStackEntry = {};
    openModalStack.push(stackEntry);
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const isTopModal = () => openModalStack[openModalStack.length - 1] === stackEntry;
    const getFocusable = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []);
    const restoreFocus = () => {
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!isTopModal()) return;
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) panelRef.current.focus();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTopModal()) return;
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = getFocusable();
      if (focusable.length === 0) { event.preventDefault(); panelRef.current.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panelRef.current.contains(document.activeElement)) { event.preventDefault(); panelRef.current.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onKeyDown);
      const wasTopModal = isTopModal();
      removeFromModalStack(stackEntry);
      if (wasTopModal) restoreFocus();
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const maxWidthClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-3xl' }[size];
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-4" role="presentation"><div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={subtitle ? descId : undefined} tabIndex={-1} className={`w-full ${maxWidthClass} rounded-lg border border-border bg-surface p-5 text-foreground shadow-card`}><header className="mb-4 flex items-start justify-between gap-4"><div><h2 id={titleId} className="flex items-center gap-2 font-headings text-xl font-bold">{icon}{title}</h2>{subtitle && <p id={descId} className="mt-1 text-sm text-foreground-muted">{subtitle}</p>}</div><button type="button" onClick={onClose} aria-label="Close" className="min-h-11 min-w-11 rounded-md focus-visible:outline-2 focus-visible:outline-border-focus">×</button></header>{children}</div></div>;
}
