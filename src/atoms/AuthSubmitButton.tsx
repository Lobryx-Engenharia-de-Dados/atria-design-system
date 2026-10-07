import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

export function AuthSubmitButton({ children, loading = false, loadingText, icon, className = '', disabled, type = 'submit', ...props }: AuthSubmitButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading} className={`w-full bg-primary text-foreground-on-dark font-bold py-4 rounded-xl hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-1 flex items-center justify-center gap-2 group ${className}`}>
      {loading ? (loadingText ?? children) : children}
      {icon}
    </button>
  );
}
