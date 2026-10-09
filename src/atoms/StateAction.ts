import type { ReactNode } from 'react';

export interface StateAction {
  label: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}
