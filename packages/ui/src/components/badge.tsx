import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@sociolume/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'neutral'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', ...props }, ref) => {
    const variantClasses = {
      neutral: 'badge-neutral',
      primary: 'badge-primary',
      secondary: 'badge-secondary',
      accent: 'badge-accent',
      info: 'badge-info',
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
    };

    const sizeClasses = {
      xs: 'badge-xs',
      sm: 'badge-sm',
      md: '',
      lg: 'badge-lg',
    };

    return (
      <span
        ref={ref}
        className={cn('badge', variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
