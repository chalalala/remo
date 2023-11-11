import { ChevronDownIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { FC, PropsWithChildren, SyntheticEvent, useState } from 'react';
import { IconButton } from '../IconButton';
import { EditableContent } from '../EditableContent';

interface Props extends PropsWithChildren {
  defaultOpen?: boolean;
  defaultEditing?: boolean;
  title: string;
  addBtnTitle?: string;
  removeBtnTitle?: string;
  onChangeTitle?: (newTitle: string) => void;
  onRemove?: () => void;
  onAdd?: () => void;
}

export const EditableAccordion: FC<Props> = ({
  children,
  defaultOpen = true,
  defaultEditing = false,
  title,
  addBtnTitle,
  removeBtnTitle,
  onChangeTitle,
  onRemove,
  onAdd,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isEditing, setIsEditing] = useState(defaultEditing);

  const onToggleDetails = (event: SyntheticEvent<HTMLDetailsElement, Event>) => {
    setIsOpen((event.target as HTMLDetailsElement).open);
  };

  const onDoubleClickText = () => {
    setIsEditing(true);
  };

  return (
    <details
      open={isOpen}
      onToggle={onToggleDetails}
    >
      <summary
        className={clsx(
          'flex list-none items-center justify-between gap-4',
          'cursor-pointer select-none',
        )}
        title={title}
      >
        <div className="flex h-5 min-w-0 flex-1 items-center gap-2">
          <ChevronDownIcon
            className={clsx('h-4 w-4 shrink-0', {
              'rotate-180 transform': isOpen,
            })}
          />

          <EditableContent
            isEditing={isEditing}
            title={title}
            defaultEditing={defaultEditing}
            onSubmit={onChangeTitle}
            setIsEditing={setIsEditing}
            onDoubleClick={onDoubleClickText}
          />
        </div>

        <div className="flex items-center">
          <IconButton
            title={addBtnTitle}
            onClick={onAdd}
          >
            <PlusIcon className="h-3 w-3" />
          </IconButton>

          <IconButton
            title={removeBtnTitle}
            onClick={onRemove}
          >
            <MinusIcon className="h-3 w-3" />
          </IconButton>
        </div>
      </summary>

      {children}
    </details>
  );
};
