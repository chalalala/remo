import { SectionItem, Section as SectionType } from '@/types/Resource';
import { FC, useMemo } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { DraggableItem } from '../DraggableItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useEditableContent } from '@/hooks/useEditableContent';
import { useDatabaseQuery } from '@/hooks/useDatabaseQuery';
import { sqlQuery } from '@/constants/queries';
import { useAppContext } from '@/context/AppContext';
import { getDataFromActiveTab } from '@/utils/chrome-api';
import { useRemoteData } from '@/hooks/useRemoteData';

interface Props {
  section: SectionType;
  onChangeTitle: (sectionId: string, value: string) => void;
  onRemoveSection: (sectionId: string) => void;
}

export const Section: FC<Props> = ({ section, onChangeTitle, onRemoveSection }) => {
  const { db, accessToken } = useAppContext();
  const { mutate } = useRemoteData(accessToken);
  const { getQueryResultAsJson } = useDatabaseQuery();
  const sectionItems = useMemo(() => {
    return getQueryResultAsJson<SectionItem>(sqlQuery.SELECT_SECTION_ITEMS, {
      ':sectionId': section.id,
    });
  }, [section.id, getQueryResultAsJson]);

  const {
    name: newItemName,
    setName: setNewItemName,
    openAdd: openAddNewItem,
  } = useEditableContent();

  const onAddNewItem = async (value: string) => {
    setNewItemName(null);

    // Not to add new item if the name is empty
    if (!value || !db) {
      return;
    }

    const { icon, url } = await getDataFromActiveTab();

    // Append item to database
    db.exec(sqlQuery.INSERT_SECTION_ITEM, {
      ':name': value,
      ':sectionId': section.id,
      ':icon': icon,
      ':url': url,
    });

    // Move item to top
    db.exec(sqlQuery.REORDER_SECTION_ITEM, {
      ':sourceSeq': sectionItems.length - 1,
      ':targetSeq': sectionItems[0].seq,
      ':sourceSection': section.id,
      ':targetSection': section.id,
    });

    mutate(db.export().buffer);
  };

  const onRemoveItem = (itemId: string) => {
    if (!db) {
      return;
    }

    db.exec(sqlQuery.DELETE_SECTION_ITEM, {
      ':itemId': itemId,
    });

    mutate(db.export().buffer);
  };

  const onRenameItem = (itemId: string, value: string) => {
    if (!db) {
      return;
    }

    db.exec(sqlQuery.RENAME_SECTION_ITEM, {
      ':name': value,
      ':itemId': itemId,
    });

    mutate(db.export().buffer);
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

            {sectionItems.map((item, index) => (
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
                      onChangeTitle={(value) => onRenameItem(item.id, value)}
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
