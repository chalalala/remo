import clsx from 'clsx';
import React, { ButtonHTMLAttributes, FC, PropsWithChildren, forwardRef } from 'react';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const IconButton: FC<Props> = forwardRef<HTMLButtonElement, Props>(
  ({ children, className, ...buttonProps }, ref) => {
    return (
      <button
        className={clsx(
          'aspect-square rounded-full p-1 transition-all',
          'hover:bg-indigo-50 hover:text-indigo-500',
          className,
        )}
        ref={ref}
        {...buttonProps}
      >
        {children}
      </button>
    );
  },
);
