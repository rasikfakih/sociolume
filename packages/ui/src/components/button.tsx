import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@sociolume/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error' | 'success' | 'soft';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variantClasses = {
      primary: 'btn bg-brand-600 hover:bg-brand-700 text-white border-0 shadow-soft transition-all duration-200',
      secondary: 'btn bg-base-200 hover:bg-base-300 text-base-content border-0',
      outline: 'btn border-base-300 bg-transparent hover:bg-base-100 text-base-content',
      ghost: 'btn bg-transparent hover:bg-base-200 text-base-content border-0',
      error: 'btn bg-error/90 hover:bg-error text-white border-0 shadow-soft',
      success: 'btn bg-success/90 hover:bg-success text-white border-0 shadow-soft',
      soft: 'btn bg-brand-50 hover:bg-brand-100 text-brand-700 border-0',
    };

    const sizeClasses = {
      xs: 'h-8 px-3 text-xs',
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-12 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'btn rounded-xl font-medium transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="loading loading-spinner loading-sm" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
