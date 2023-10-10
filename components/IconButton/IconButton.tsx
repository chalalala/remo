import clsx from 'clsx';
import React, { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const IconButton: FC<Props> = ({ children, className, ...buttonProps }) => {
  return (
    <button
      className={clsx(
        'aspect-square rounded-full p-1 transition-all',
        'hover:bg-indigo-50 hover:text-indigo-500',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
