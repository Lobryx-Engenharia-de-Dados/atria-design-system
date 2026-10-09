import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps =
  | (ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; href?: never })
  | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    variant?: ButtonVariant;
    className?: string;
    href: string;
    disabled?: boolean;
  });

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-accent-hover',
  secondary: 'border border-border bg-surface-elevated text-foreground hover:border-border-focus',
  ghost: 'bg-transparent text-foreground-secondary hover:bg-surface hover:text-foreground'
};

export function Button(props: ButtonProps) {
  const { className = '', variant = 'primary' } = props;
  const classes = `inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 font-sans text-sm font-semibold transition-colors duration-normal ease-standard focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`;

  if ('href' in props && props.href !== undefined) {
    const { href, disabled, onClick, className: _className, variant: _variant, ...anchorProps } = props;
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        {...anchorProps}
        onClick={disabled ? (event) => event.preventDefault() : onClick}
      />
    );
  }

  const { disabled, className: _className, variant: _variant, ...buttonProps } = props;
  return (
    <button
      className={classes}
      disabled={disabled}
      {...buttonProps}
    />
  );
}
