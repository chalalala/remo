import { DotsVerticalIcon, FolderIcon, XIcon } from '@heroicons/react/solid';
import React, { FC } from 'react';
import { IconButton } from '../IconButton';

interface Props {
  variant?: 'default' | 'minimal';
}

export const Header: FC<Props> = ({ variant = 'default' }) => {
  if (variant === 'minimal') {
    return (
      <header className="flex justify-end bg-indigo-500 p-4 text-white">
        <IconButton>
          <XIcon className="h-4 w-4 text-inherit" />
        </IconButton>
      </header>
    );
  }

  return (
    <header className="flex items-center gap-4 bg-indigo-500 p-4 text-white">
      <div className="flex items-center">
        <FolderIcon className="mx-2 h-5 w-5" />
        <span className="text-sm font-medium uppercase">Space</span>
      </div>
      <span className="flex-1">Space selector</span> {/* TODO: Implement space selector */}
      <IconButton className="w-6">
        <DotsVerticalIcon />
      </IconButton>
    </header>
  );
};
