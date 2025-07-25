import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'text';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
  className?: string;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium transition-colors disabled:opacity-60 disabled:pointer-events-none border-none outline-none shadow-none focus:ring-0 focus:outline-none';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700',
  secondary:
    'bg-white text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-100',
  text:
    'bg-transparent px-2 py-1', // No text color, let className control it
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', loading = false, disabled, children, className = '', ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={[
          baseStyles,
          variantStyles[variant],
          className,
        ].join(' ')}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="animate-spin mr-2 w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'; 