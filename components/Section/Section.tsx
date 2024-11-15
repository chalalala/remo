import { Section as SectionType } from '@/types/Resource';
import { FC, useEffect, useState } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { DraggableItem } from '../DraggableItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useEditableContent } from '@/hooks/useEditableContent';
import { useAppContext } from '@/context/AppContext';
import { addItem, removeItem, updateItem } from '@/utils/sections/sectionItem';
import { getDataFromActiveTab, isExtension } from '@/lib/chromeApi';
import { DuplicatedAlertModal } from '../DuplicatedAlertModal';

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
    setDefaultName: setItemDefaultName,
    openAdd: openAddNewItem,
  } = useEditableContent();
  const [issOpenDuplicatedAlert, setIsOpenDuplicatedAlert] = useState(false);

  const checkIsDuplicatedLink = async () => {
    if (!isExtension()) {
      return false;
    }

    const { url } = await getDataFromActiveTab();

    return sections.some((section) => section.items.some((item) => item.url === url));
  };

  const startAddNewItem = async () => {
    const isDuplicatedLink = await checkIsDuplicatedLink();

    if (isDuplicatedLink) {
      setIsOpenDuplicatedAlert(true);

      return;
    }

    openAddNewItem();
  };

  const onConfirmAddDuplicatedItem = async () => {
    await setIsOpenDuplicatedAlert(false);
    openAddNewItem();
  };

  const onAddNewItem = async (value: string) => {
    setNewItemName(null);

    // Not to add new item if the name is empty
    if (!value) {
      return;
    }

    const newSections = await addItem(sections, section.id, value);

    setSections(newSections);
  };

  const onRemoveItem = (itemId: string) => {
    const newSections = removeItem(sections, section.id, itemId);

    setSections(newSections);
  };

  const onRenameItem = (itemId: string, value: string) => {
    const newSections = updateItem(sections, section.id, itemId, { name: value });

    setSections(newSections);
  };

  useEffect(() => {
    (async () => {
      if (!isExtension()) {
        return;
      }

      const activeTabData = await getDataFromActiveTab();

      setItemDefaultName(activeTabData.title || '');
    })();
  });

  return (
    <EditableAccordion
      key={section.id}
      title={section.name}
      addBtnTitle="Add item"
      removeBtnTitle="Remove section"
      onChangeTitle={(value) => onChangeTitle(section.id, value)}
      onRemove={() => onRemoveSection(section.id)}
      onAdd={startAddNewItem}
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

      <DuplicatedAlertModal
        isOpen={issOpenDuplicatedAlert}
        setIsOpen={setIsOpenDuplicatedAlert}
        onConfirm={onConfirmAddDuplicatedItem}
        onCancel={() => setIsOpenDuplicatedAlert(false)}
      />
    </EditableAccordion>
  );
};
