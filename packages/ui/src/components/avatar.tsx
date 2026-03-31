import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@sociolume/utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', status, ...props }, ref) => {
    const sizeClasses = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    const indicatorSizeClasses = {
      xs: 'w-2 h-2',
      sm: 'w-2.5 h-2.5',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
      xl: 'w-5 h-5',
    };

    return (
      <div ref={ref} className={cn('avatar', status && 'online', className)} {...props}>
        <div className={cn('rounded-full', sizeClasses[size])}>
          {src ? (
            <img src={src} alt={alt || ''} />
          ) : (
            <div className="bg-neutral text-neutral-content flex items-center justify-center w-full h-full text-sm font-medium">
              {fallback || '?'}
            </div>
          )}
        </div>
        {status && (
          <div
            className={cn(
              'absolute bottom-0 right-0 rounded-full bg-success',
              indicatorSizeClasses[size]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export const AvatarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('avatar-group -space-x-6', className)} {...props} />
  )
);

AvatarGroup.displayName = 'AvatarGroup';
