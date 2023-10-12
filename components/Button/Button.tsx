import clsx from 'clsx';
import React, { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';

export const enum ButtonVariant {
  SOLID = 'solid',
  DASHED = 'dashed',
}

interface Props extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
  className?: string;
}

export const Button: FC<Props> = ({
  children,
  variant = ButtonVariant.SOLID,
  className,
  ...props
}) => {
  const isDashedBtn = variant === ButtonVariant.DASHED;

  return (
    <button
      className={clsx(
        'rounded font-medium',
        {
          [clsx(
            'border border-dashed border-gray-500 px-2 py-1',
            'text-sm leading-normal text-gray-500',
          )]: isDashedBtn,
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
