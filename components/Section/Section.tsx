import { Section as SectionType } from '@/types/Resource';
import React, { FC } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { DraggableItem } from '../DraggableItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useEditableContent } from '@/hooks/useEditableContent';
import { addItem, removeItem } from '@/utils/sectionItem';
import { useAppContext } from '@/context/AppContext';

interface Props {
  section: SectionType;
  onChangeTitle: (sectionId: string, value: string) => void;
  onRemoveSection: (sectionId: string) => void;
}

export const Section: FC<Props> = ({ section, onChangeTitle, onRemoveSection }) => {
  const { sections, setSections } = useAppContext();
  const {
    name: newItemName,
    setName: setNewItemName,
    openAdd: openAddNewItem,
  } = useEditableContent();

  const onAddNewItem = (value: string) => {
    setNewItemName(null);

    // Not to add new item if the name is empty
    if (!value) {
      return;
    }

    const newSections = addItem(sections, section.id, value);

    setSections(newSections);
  };

  const onRemoveItem = (itemId: string) => {
    const newSections = removeItem(sections, section.id, itemId);

    setSections(newSections);
  };

  return (
    <EditableAccordion
      key={section.id}
      title={section.name}
      addBtnTitle="Add item"
      removeBtnTitle="Remove section"
      onChangeTitle={(value) => onChangeTitle(section.id, value)}
      onRemove={() => onRemoveSection(section.id)}
      onAdd={openAddNewItem}
    >
      <Droppable droppableId={section.id}>
        {(provided) => (
          <div
            className="space-y-1 pt-2.5"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {typeof newItemName === 'string' ? (
              <DraggableItem
                title={newItemName}
                defaultEditing
                onChangeTitle={onAddNewItem}
              />
            ) : null}

            {section.items.map((item, index) => (
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
                  >
                    <DraggableItem
                      sectionId={section.id}
                      itemId={item.id}
                      icon={item.icon}
                      title={item.name}
                      url={item.url}
                      onRemove={() => onRemoveItem(item.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </EditableAccordion>
  );
};
