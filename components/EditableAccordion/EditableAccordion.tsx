import { ChevronDownIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { ChangeEvent, FC, MouseEvent, PropsWithChildren, SyntheticEvent, useState } from 'react';
import { IconButton } from '../IconButton';

interface Props extends PropsWithChildren {
  defaultOpen?: boolean;
  title: string;
  onChangeTitle?: (newTitle: string) => void;
}

export const EditableAccordion: FC<Props> = ({
  children,
  defaultOpen = true,
  title,
  onChangeTitle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);

  const onToggleDetails = (event: SyntheticEvent<HTMLDetailsElement, Event>) => {
    setIsOpen((event.target as HTMLDetailsElement).open);
  };

  const onSummaryClick = (event: MouseEvent<HTMLDetailsElement>) => {
    // Prevent toggling details when in editing mode
    if (isEditing) {
      event.preventDefault();
    }
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const onBlurInput = () => {
    setIsEditing(false);

    if (typeof onChangeTitle === 'function') {
      onChangeTitle(editingTitle);
    }
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
        title={editingTitle}
        onClick={onSummaryClick}
      >
        <div className="flex h-5 min-w-0 flex-1 items-center gap-2">
          <ChevronDownIcon
            className={clsx('h-4 w-4 shrink-0', {
              'rotate-180 transform': isOpen,
            })}
          />
          {isEditing ? (
            <input
              className="h-full w-full border-b border-b-gray-700 outline-none"
              value={editingTitle}
              onChange={onChangeInput}
              onBlur={onBlurInput}
              autoFocus
            />
          ) : (
            <span
              className="mb-px h-full w-full truncate"
              onDoubleClick={onDoubleClickText}
            >
              {editingTitle}
            </span>
          )}
        </div>

        <div className="flex items-center">
          <IconButton title="Add">
            <PlusIcon className="h-3 w-3" />
          </IconButton>

          <IconButton title="Remove">
            <MinusIcon className="h-3 w-3" />
          </IconButton>
        </div>
      </summary>

      {children}
    </details>
  );
};
