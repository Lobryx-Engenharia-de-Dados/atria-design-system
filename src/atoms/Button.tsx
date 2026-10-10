import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; icon?: ReactNode; href?: never })
  | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: ReactNode;
    className?: string;
    href: string;
    disabled?: boolean;
  });

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-accent-hover',
  secondary: 'border border-border bg-surface-elevated text-foreground hover:border-border-focus',
  outline: 'border border-border bg-transparent text-foreground hover:bg-surface',
  ghost: 'bg-transparent text-foreground-secondary hover:bg-surface hover:text-foreground',
  danger: 'bg-status-error text-status-error-foreground hover:bg-status-error/90'
};
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-3 text-base'
};

export function Button(props: ButtonProps) {
  const { className = '', variant = 'primary', size = 'md', loading = false, icon } = props;
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-md font-sans font-semibold transition-colors duration-normal ease-standard focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  const content = <>{loading && <span className="animate-pulse">Loading</span>}{icon}{props.children}</>;

  if ('href' in props && props.href !== undefined) {
    const { href, disabled, onClick, className: _className, variant: _variant, size: _size, loading: _loading, icon: _icon, children: _children, ...anchorProps } = props;
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        aria-busy={loading || undefined}
        {...anchorProps}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
      >{content}</a>
    );
  }

  const { disabled, className: _className, variant: _variant, size: _size, loading: _loading, icon: _icon, children: _children, ...buttonProps } = props;
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >{content}</button>
  );
}
