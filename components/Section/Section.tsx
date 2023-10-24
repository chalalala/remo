import { Section as SectionType } from '@/types/Resource';
import React, { FC } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { DraggableItem } from '../DraggableItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';

interface Props {
  section: SectionType;
  onChangeTitle: (sectionId: string, value: string) => void;
}

export const Section: FC<Props> = ({ section, onChangeTitle }) => {
  return (
    <EditableAccordion
      key={section.id}
      title={section.name}
      onChangeTitle={(value) => onChangeTitle(section.id, value)}
    >
      <Droppable droppableId={section.id}>
        {(provided) => (
          <div
            className="mt-2.5 space-y-1"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
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
                      icon={item.icon}
                      text={item.name}
                      url={item.url}
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
