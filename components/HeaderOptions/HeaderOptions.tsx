import { FC, useState } from 'react';
import { IconButton } from '../IconButton';
import { useAppContext } from '@/context/AppContext';
import { removeSpace } from '@/utils/sections/space';
import { useRemoteData } from '@/hooks/useRemoteData';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import { signOut } from '@/lib/gapi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { WEB_URL } from '@/constants/config';
import { isExtension } from '@/utils/env';

export const HeaderOptions: FC = () => {
  const [open, setOpen] = useState(false);
  const { spaces, selectedSpace, accessToken, setAccessToken } = useAppContext();
  const { mutate } = useRemoteData(accessToken);

  const onRemove = () => {
    const newSpaces = removeSpace(spaces, selectedSpace?.id || '');

    mutate(newSpaces);
    setOpen(false);
  };

  const onLogout = () => {
    signOut(() => setAccessToken(''));
    setOpen(false);
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenuTrigger>
        <IconButton className="h-6 w-6 shrink-0">
          <DotsVerticalIcon />
        </IconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="p-0"
      >
        {isExtension() ? (
          <>
            <DropdownMenuItem className="cursor-pointer">
              <a
                href={WEB_URL}
                target="_blank"
                rel="noreferrer"
              >
                Open on web
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-0" />
          </>
        ) : null}

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={onRemove}
        >
          Remove space
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
