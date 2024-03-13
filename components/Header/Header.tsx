import { FolderIcon } from '@heroicons/react/solid';
import { FC } from 'react';
import { SpaceSelector } from '../SpaceSelector';
import { HeaderOptions } from '../HeaderOptions';

interface Props {
  variant?: 'default' | 'minimal';
}

export const Header: FC<Props> = ({ variant = 'default' }) => {
  if (variant === 'minimal') {
    return <header className="sticky top-0 h-12 bg-indigo-500 p-4 text-white"></header>;
  }

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 bg-indigo-500 p-4 text-white">
      <div className="flex items-center">
        <FolderIcon className="mx-2 h-5 w-5" />
        <span className="text-sm font-medium uppercase">Space</span>
      </div>
      <SpaceSelector className="flex-1" />
      <HeaderOptions />
    </header>
  );
};
