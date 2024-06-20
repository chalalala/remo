import { FC, useState } from 'react';
import { IconButton } from '../IconButton';
import { useAppContext } from '@/context/AppContext';
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
import { isExtension } from '@/lib/chromeApi';
import { EditSpaceModal } from '../EditSpaceModal';
import { writeFile } from '@/utils/file';
import { ImportSpaceModal } from '../ImportSpaceModal';
import { useEditSpace } from '@/hooks/useEditSpace';

const enum headerAction {
  EDIT_SPACE,
  IMPORT_SPACE,
}

export const HeaderOptions: FC = () => {
  const [open, setOpen] = useState(false);
  const { selectedSpace, setAccessToken } = useAppContext();
  const [activeAction, setActiveAction] = useState<headerAction | undefined>();
  const isUsingExtension = isExtension();
  const { onRemoveSpace } = useEditSpace();

  const onLogout = () => {
    signOut(() => setAccessToken(''));
    setOpen(false);
  };

  const handleRemoveSpace = () => {
    onRemoveSpace();
    setActiveAction(undefined);
  };

  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
      >
        <DropdownMenuTrigger asChild>
          <IconButton className="h-6 w-6 shrink-0">
            <DotsVerticalIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="p-0"
        >
          {isUsingExtension ? (
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

          {selectedSpace ? (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setActiveAction(headerAction.EDIT_SPACE)}
              >
                Edit space
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleRemoveSpace}
              >
                Remove space
              </DropdownMenuItem>
            </>
          ) : null}

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setActiveAction(headerAction.IMPORT_SPACE)}
          >
            Import space
          </DropdownMenuItem>

          {selectedSpace ? (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => writeFile(JSON.stringify(selectedSpace), `${selectedSpace.name}.json`)}
            >
              Export space
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuSeparator className="my-0" />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={onLogout}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSpaceModal
        isEditingSpace={activeAction === headerAction.EDIT_SPACE}
        setIsEditingSpace={(value) => setActiveAction(value ? headerAction.EDIT_SPACE : undefined)}
      />

      <ImportSpaceModal
        isEditingSpace={activeAction === headerAction.IMPORT_SPACE}
        setIsImportingSpace={(value) =>
          setActiveAction(value ? headerAction.IMPORT_SPACE : undefined)
        }
      />
    </>
  );
};
