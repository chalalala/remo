import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { DraggableItem } from '../DraggableItem';
import { IconButton } from '../IconButton';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import { FC, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { removeSpace, renameSpace } from '@/utils/sections/space';
import { useRemoteData } from '@/hooks/useRemoteData';
import { removeSection, renameSection, reorderSections } from '@/utils/sections/sectionList';
import { EditableContent } from '../EditableContent';
import clsx from 'clsx';

interface Props {
  isEditingSpace: boolean;
  setIsEditingSpace: (value: boolean) => void;
}

export const EditSpaceModal: FC<Props> = ({ isEditingSpace, setIsEditingSpace }) => {
  const { spaces, sections, selectedSpace, accessToken, setSections } = useAppContext();
  const { isLoading, mutate } = useRemoteData(accessToken);
  const [isEditing, setIsEditing] = useState(false);

  const onRemoveSpace = () => {
    if (isLoading) {
      return;
    }

    const newSpaces = removeSpace(spaces, selectedSpace?.id || '');

    mutate(newSpaces);
    setIsEditingSpace(false);
  };

  const onRenameSpace = (name: string) => {
    if (isLoading) {
      return;
    }

    const newSpaces = renameSpace(spaces, selectedSpace?.id || '', name);

    mutate(newSpaces);
  };

  const onRemoveSection = (sectionId: string) => {
    const newSections = removeSection(sections, sectionId);

    setSections(newSections);
  };

  const onRenameSection = (sectionId: string, value: string) => {
    const newSections = renameSection(sections, sectionId, value);

    setSections(newSections);
  };

  const onReorderSections = (result: DropResult) => {
    const newSections = reorderSections(sections, result);

    setSections(newSections);
  };

  return (
    <Dialog
      open={isEditingSpace}
      onOpenChange={setIsEditingSpace}
    >
      <DialogContent className="max-h-[80vh] max-w-[80vw] rounded-1.5 p-4">
        <DialogHeader className="min-h-6 flex-row items-center gap-1 space-y-0 pr-5 text-left">
          <EditableContent
            title={selectedSpace?.name || ''}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onSubmit={onRenameSpace}
            className={clsx('max-w-full text-sm font-medium', isEditing ? 'w-full' : 'w-fit')}
          />
          {isEditing ? null : (
            <span className="shrink-0 text-gray-500">
              <IconButton
                title="Rename space"
                aria-label="Rename space"
                onClick={() => setIsEditing(true)}
              >
                <PencilAltIcon className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                title="Remove space"
                aria-label="Remove space"
                onClick={onRemoveSpace}
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </IconButton>
            </span>
          )}
        </DialogHeader>
        <div>
          <DragDropContext onDragEnd={onReorderSections}>
            <Droppable droppableId={selectedSpace?.id || ''}>
              {(provided) => (
                <div
                  className="space-y-1"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {selectedSpace?.sections
                    ? selectedSpace.sections.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                left: 'auto !important',
                                top: 'auto !important',
                              }}
                            >
                              <DraggableItem
                                sectionId={selectedSpace.id}
                                itemId={item.id}
                                icon=""
                                title={item.name}
                                url=""
                                onRemove={() => onRemoveSection(item.id)}
                                onChangeTitle={(value) => onRenameSection(item.id, value)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    : null}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </DialogContent>
    </Dialog>
  );
};
