import { FolderIcon, RefreshIcon } from '@heroicons/react/solid';
import { FC } from 'react';
import { SpaceSelector } from '../SpaceSelector';
import { HeaderOptions } from '../HeaderOptions';
import { IconButton } from '../IconButton';
import { useRemoteData } from '@/hooks/useRemoteData';
import { useAppContext } from '@/context/AppContext';
import clsx from 'clsx';
import { useResources } from '@/stores/resources';

interface Props {
  variant?: 'default' | 'minimal';
}

export const Header: FC<Props> = ({ variant = 'default' }) => {
  const { accessToken } = useAppContext();
  const { isBackingUp } = useResources();
  const { refresh, isLoading } = useRemoteData(accessToken);

  if (variant === 'minimal') {
    return (
      <header className="sticky top-0 h-12 bg-indigo-500 p-4 text-white desktop:hidden"></header>
    );
  }

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 bg-indigo-500 p-4 text-white">
      <div className="flex items-center">
        <FolderIcon className="mx-2 h-5 w-5" />
        <span className="text-sm font-medium uppercase">Space</span>
      </div>
      <SpaceSelector className="flex-1" />
      <div className="flex items-center gap-1">
        <IconButton
          className={clsx('h-6 w-6 shrink-0', {
            'animate-spin': isLoading || isBackingUp,
          })}
          onClick={() => refresh()}
        >
          <RefreshIcon />
        </IconButton>
        <HeaderOptions />
      </div>
    </header>
  );
};
