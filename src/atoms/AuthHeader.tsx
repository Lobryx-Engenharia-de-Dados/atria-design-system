import type { ReactNode } from 'react';
import { Wordmark } from './Wordmark.js';

export interface AuthHeaderProps {
  name: ReactNode;
  platformName?: ReactNode;
}

export function AuthHeader({ name, platformName }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <Wordmark name={name} className="text-3xl" />
      {platformName && (
        <p className="text-foreground-on-dark-muted text-xs tracking-widest uppercase mt-2">
          {platformName}
        </p>
      )}
    </div>
  );
}
