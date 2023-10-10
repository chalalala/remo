import React, { FC, PropsWithChildren } from 'react';
import { Header } from '../Header/Header';
import clsx from 'clsx';
import { roboto } from '@/constants/typography';

interface Props extends PropsWithChildren {
  type?: 'account' | 'main';
}

export const Layout: FC<Props> = ({ children, type = 'main' }) => {
  return (
    <div
      className={clsx(
        'mx-auto w-[480px] max-w-full overflow-hidden rounded shadow-md',
        roboto.variable,
      )}
    >
      <Header variant={type === 'account' ? 'minimal' : 'default'} />

      <main>{children}</main>
    </div>
  );
};
