import clsx from 'clsx';
import { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export const enum ButtonVariant {
  PRIMARY,
  SECONDARY,
  DASHED,
}

interface Props extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
  className?: string;
}

export const Button: FC<Props> = ({
  children,
  variant = ButtonVariant.PRIMARY,
  className,
  ...props
}) => {
  return (
    <button
      className={twMerge(
        clsx(
          'rounded font-medium',
          {
            [clsx(
              'border border-dashed border-gray-500 px-2 py-1',
              'text-sm leading-normal text-gray-500',
            )]: variant === ButtonVariant.DASHED,
            [clsx('bg-primary px-4 py-1.5 font-medium uppercase text-white disabled:opacity-50')]:
              variant === ButtonVariant.PRIMARY,
            [clsx('bg-secondary px-4 py-1.5 font-medium uppercase')]:
              variant === ButtonVariant.SECONDARY,
          },
          className,
        ),
      )}
      {...props}
    >
      {children}
    </button>
  );
};
