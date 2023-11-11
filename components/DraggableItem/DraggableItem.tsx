import { FC, useState } from 'react';
import { Image } from '../Image';
import { IconButton } from '../IconButton';
import { LinkIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import { DraggableItemTextWrapper } from './DraggableItemTextWrapper';
import { EditableContent } from '../EditableContent';

interface Props {
  title: string;
  icon?: string;
  url?: string;
  defaultEditing?: boolean;
  onChangeTitle?: (newTitle: string) => void;
  onRemove?: () => void;
}

export const DraggableItem: FC<Props> = ({
  title,
  icon,
  url,
  defaultEditing = false,
  onChangeTitle,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(defaultEditing);

  return (
    <div className="flex min-w-0 items-center gap-2 show-child-on-hover">
      <span className="shrink-0">
        <Image
          src="/svgs/draggable.svg"
          alt="Draggable"
          className="h-4 w-4"
        />
      </span>

      <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-1">
        <div className="flex w-full min-w-0 items-center gap-1">
          <IconButton className="shrink-0">
            {url ? (
              <Image
                src={icon || '/svgs/earth.svg'}
                alt={title}
                className="h-4 w-4"
              />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
          </IconButton>

          <EditableContent
            isEditing={isEditing}
            title={title}
            defaultEditing={defaultEditing}
            setIsEditing={setIsEditing}
            onSubmit={onChangeTitle}
            TitleWrapper={(props) => (
              <DraggableItemTextWrapper
                title={title}
                url={url}
                className="flex-1 truncate text-sm"
                {...props}
              />
            )}
          />
        </div>

        <div className="shrink-0 items-center leading-none child">
          <IconButton onClick={() => setIsEditing(true)}>
            <PencilIcon className="h-4 w-4" />
          </IconButton>
          <IconButton onClick={onRemove}>
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
