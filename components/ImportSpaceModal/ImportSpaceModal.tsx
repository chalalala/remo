import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { ChangeEvent, FC, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRemoteData } from '@/hooks/useRemoteData';
import { Input } from '../ui/input';
import { Button, ButtonVariant } from '../Button';
import { Space } from '@/types/Resource';

interface Props {
  isEditingSpace: boolean;
  setIsImportingSpace: (value: boolean) => void;
}

const enum errorMessage {
  DUPLICATED_SPACE = 'Found a space with identical id. Continue importing will override the existing space.',
  DEFAULT = 'Uh oh! Something went wrong reading the file.',
}

export const ImportSpaceModal: FC<Props> = ({ isEditingSpace, setIsImportingSpace }) => {
  const { spaces, accessToken, setSelectedSpaceId } = useAppContext();
  const { isLoading, mutate } = useRemoteData(accessToken);
  const [importingSpace, setImportingSpace] = useState<Space | undefined>();
  const [error, setError] = useState('');

  const onImportSpace = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    const reader = new FileReader();

    reader.onload = function () {
      const contents = reader.result;

      if (typeof contents === 'string') {
        try {
          const jsonContent: Space = JSON.parse(contents);

          setImportingSpace(jsonContent);

          if (spaces.some((space) => space.id === jsonContent.id)) {
            setError(errorMessage.DUPLICATED_SPACE);
          }
        } catch (error) {
          event.target.value = '';

          setError(errorMessage.DEFAULT);
        }
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const onSubmit = () => {
    if (isLoading || !importingSpace) {
      return;
    }

    const filteredDuplicatedSpaces = spaces.filter((space) => space.id !== importingSpace.id);

    mutate([...filteredDuplicatedSpaces, importingSpace]);
    setSelectedSpaceId(importingSpace.id);
    setIsImportingSpace(false);
    setImportingSpace(undefined);
    setError('');
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setImportingSpace(undefined);
      setError('');
    }

    setIsImportingSpace(open);
  };

  return (
    <Dialog
      open={isEditingSpace}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[80vh] max-w-[80vw] rounded-1.5 p-4 desktop:w-[403px]">
        <DialogHeader className="text-left text-sm font-medium">Import space</DialogHeader>
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="space-y-2">
            <Input
              className="cursor-pointer"
              type="file"
              onChange={onImportSpace}
            />
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
          </div>
          <div className="space-x-1.5 text-right">
            <Button
              onClick={onSubmit}
              disabled={error === errorMessage.DEFAULT}
            >
              Import
            </Button>
            <Button
              variant={ButtonVariant.SECONDARY}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
