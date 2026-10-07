export interface SkeletonProps {
  readonly className?: string;
}

/**
 * Decorative loading placeholder. The containing region owns the `aria-busy`
 * state and accessible loading message, so the skeleton itself is hidden from
 * assistive technology.
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-elevated)] ${className}`}
    />
  );
}
