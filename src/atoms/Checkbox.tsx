import { useId, type ChangeEvent, type ReactNode } from 'react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export function Checkbox({ checked, onChange, label, description, disabled = false, id, name }: CheckboxProps) {
  const generatedId = `checkbox-${useId()}`;
  const controlId = id ?? generatedId;
  const descriptionId = `${controlId}-description`;
  return <label htmlFor={controlId} className="flex min-h-11 cursor-pointer items-start gap-3 text-foreground">
    <input id={controlId} name={name} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} aria-describedby={description ? descriptionId : undefined} className="mt-1 h-4 w-4 accent-accent focus-visible:outline-2 focus-visible:outline-border-focus" />
    <span>{label}{description && <span id={descriptionId} className="block text-sm text-foreground-muted">{description}</span>}</span>
  </label>;
}
