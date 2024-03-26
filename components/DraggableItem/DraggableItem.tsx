import { FC, useState } from 'react';
import { Image } from '../Image';
import { IconButton } from '../IconButton';
import { PencilIcon, TrashIcon } from '@heroicons/react/solid';
import { DraggableItemTextWrapper } from './DraggableItemTextWrapper';
import { EditableContent } from '../EditableContent';
import { DraggableItemPopover } from './DraggableItemPopover';
import { useAppContext } from '@/context/AppContext';

interface Props {
  sectionId?: string;
  itemId?: string;
  title: string;
  icon?: string;
  url?: string;
  defaultEditing?: boolean;
  onChangeTitle?: (newTitle: string) => void;
  onRemove?: () => void;
}

export const DraggableItem: FC<Props> = ({
  sectionId,
  itemId,
  title,
  icon,
  url,
  defaultEditing = false,
  onChangeTitle,
  onRemove,
}) => {
  const { sections, setSections } = useAppContext();
  const [isEditing, setIsEditing] = useState(defaultEditing);

  return (
    <div className="flex min-w-0 items-center gap-2 show-child-on-hover">
      <span className="shrink-0">
        <Image
          src="/icons/draggable.svg"
          alt="Draggable"
          className="h-4 w-4"
        />
      </span>

      <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-1">
        <div className="flex min-w-0 shrink-0 items-center gap-1">
          <DraggableItemPopover
            sections={sections}
            setSections={setSections}
            sectionId={sectionId}
            itemId={itemId}
            url={url}
            title={title}
            icon={icon}
          />

          <EditableContent
            isEditing={isEditing}
            title={title}
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

        <div className="flex-1 -translate-y-2 self-stretch border-b border-dashed border-gray-500 child" />

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
