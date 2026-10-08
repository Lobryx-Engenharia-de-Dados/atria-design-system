import type { ReactNode } from 'react';

export type ContainerSize = 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps {
  size?: ContainerSize;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-7xl',
  full: ''
};

export function Container({ size = 'xl', children, className = '' }: ContainerProps) {
  return <div className={`mx-auto w-full px-6 py-8 ${sizeClasses[size]} ${className}`}>{children}</div>;
}
