import { Section as SectionType } from '@/types/Resource';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { DraggableItem } from '../DraggableItem';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useEditableContent } from '@/hooks/useEditableContent';
import { useAppContext } from '@/context/AppContext';
import { addItem, addItems, updateItem } from '@/utils/sections/sectionItem';
import { getDataFromActiveTab, getOpenTabs, isExtension, openUrls } from '@/lib/chromeApi';
import { useRemoveWithUndo } from '@/hooks/useRemoveWithUndo';
import { IconButton } from '../IconButton';
import { CollectionIcon, ExternalLinkIcon } from '@heroicons/react/solid';
import { toast } from '../ui/use-toast';
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

  const { removeItem } = useRemoveWithUndo();
  const links = section.items.map((item) => item.url).filter(Boolean);

  const onRemoveItem = (itemId: string) => {
    removeItem(section.id, itemId);
  };

  const onOpenAllLinks = (event: MouseEvent) => {
    // Keep the section open or closed
    event.preventDefault();
    openUrls(links);
  };

  const onSaveOpenTabs = async (event: MouseEvent) => {
    event.preventDefault();

    const tabs = await getOpenTabs();
    const { sections: newSections, addedCount } = addItems(
      sections,
      section.id,
      tabs.map(({ url, title, icon }) => ({ url, name: title, icon })),
    );

    if (addedCount) {
      setSections(newSections);
    }

    toast({
      title: addedCount
        ? `Saved ${addedCount} ${addedCount === 1 ? 'tab' : 'tabs'} to "${section.name}"`
        : `All open tabs are already in "${section.name}"`,
    });
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
      actions={
        <>
          {isExtension() ? (
            <IconButton
              title="Save open tabs"
              aria-label="Save open tabs"
              onClick={onSaveOpenTabs}
            >
              <CollectionIcon className="h-3 w-3" />
            </IconButton>
          ) : null}

          {links.length ? (
            <IconButton
              title="Open all links"
              aria-label="Open all links"
              onClick={onOpenAllLinks}
            >
              <ExternalLinkIcon className="h-3 w-3" />
            </IconButton>
          ) : null}
        </>
      }
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
