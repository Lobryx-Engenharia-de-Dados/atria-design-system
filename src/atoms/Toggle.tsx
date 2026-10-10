import type { ChangeEvent, ReactNode } from 'react';
export interface ToggleProps { checked: boolean; onChange: (event: ChangeEvent<HTMLInputElement>) => void; label: ReactNode; description?: ReactNode; disabled?: boolean }
export function Toggle({ checked, onChange, label, description, disabled = false }: ToggleProps) {
  return <label className="flex min-h-11 cursor-pointer items-start gap-3 text-foreground">
    <input type="checkbox" role="switch" checked={checked} onChange={onChange} disabled={disabled} className="mt-1 h-4 w-4 accent-accent focus-visible:outline-2 focus-visible:outline-border-focus" />
    <span>{label}{description && <span className="block text-sm text-foreground-muted">{description}</span>}</span>
  </label>;
}
