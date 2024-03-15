import { FC, PropsWithChildren } from 'react';
import { Header } from '../Header/Header';
import clsx from 'clsx';

interface Props extends PropsWithChildren {
  type?: 'account' | 'main';
}

export const Layout: FC<Props> = ({ children, type = 'main' }) => {
  return (
    <div
      className={clsx(
        'mx-auto max-h-96 w-[480px] max-w-full overflow-hidden overflow-y-auto rounded shadow-md',
        'desktop:flex desktop:h-screen desktop:max-h-unset desktop:w-full desktop:flex-col',
      )}
    >
      <Header variant={type === 'account' ? 'minimal' : 'default'} />

      <main className="desktop:flex-1">{children}</main>
    </div>
  );
};
