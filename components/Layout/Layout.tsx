import { FC, PropsWithChildren } from 'react';
import { Header } from '../Header/Header';
import clsx from 'clsx';
import { isExtension } from '@/utils/env';

interface Props extends PropsWithChildren {
  type?: 'account' | 'main';
}

export const Layout: FC<Props> = ({ children, type = 'main' }) => {
  const isExtensionEnv = isExtension();

  return (
    <div
      className={clsx('mx-auto max-w-full overflow-hidden overflow-y-auto shadow-md', {
        'h-screen desktop:flex desktop:flex-col': !isExtensionEnv,
        'max-h-96 w-[480px] rounded': isExtensionEnv,
      })}
    >
      <Header variant={type === 'account' ? 'minimal' : 'default'} />

      <main className="desktop:flex-1">{children}</main>
    </div>
  );
};
