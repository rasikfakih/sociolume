import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@sociolume/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium text-base-content mb-2"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-11 px-4 rounded-xl border border-base-300 bg-base-100 text-base-content transition-all duration-200',
            'placeholder:text-base-content/40',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            error && 'border-error focus:ring-error/20 focus:border-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm text-base-content/60">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium text-base-content mb-2"
            htmlFor={textareaId}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-[100px] px-4 py-3 rounded-xl border border-base-300 bg-base-100 text-base-content transition-all duration-200',
            'placeholder:text-base-content/40',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500',
            error && 'border-error focus:ring-error/20 focus:border-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-2 text-sm text-base-content/60">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
