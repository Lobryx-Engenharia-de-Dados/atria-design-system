import type { ReactNode } from 'react';

export interface AuthHeaderProps {
  brand?: ReactNode;
  platformName?: ReactNode;
}

export function AuthHeader({ brand, platformName }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {brand}
      {platformName && (
        <p className="text-foreground-on-dark-muted text-xs tracking-widest uppercase mt-2">
          {platformName}
        </p>
      )}
    </div>
  );
}
