import { useId, type ChangeEvent, type ReactNode } from 'react';
export interface ToggleProps { checked: boolean; onChange: (event: ChangeEvent<HTMLInputElement>) => void; label: ReactNode; description?: ReactNode; disabled?: boolean }
export function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  const id = `toggle-${useId()}`;
  const descriptionId = `${id}-description`;
  return <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 text-foreground">
    <input id={id} type="checkbox" role="switch" checked={checked} aria-checked={checked} onChange={onChange} disabled={disabled} aria-describedby={description ? descriptionId : undefined} className="mt-1 h-4 w-4 accent-accent focus-visible:outline-2 focus-visible:outline-border-focus" />
    <span>{label}{description && <span id={descriptionId} className="block text-sm text-foreground-muted">{description}</span>}</span>
  </label>;
}
