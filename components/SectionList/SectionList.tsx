import { FC, useEffect, useRef } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { Button, ButtonVariant } from '../Button';
import { scrollToBottom } from '@/utils/dom';
import { Section } from '../Section';
import { DropResult } from 'react-beautiful-dnd';
import { addSection, removeSection, renameSection } from '@/utils/sectionList';
import { useAppContext } from '@/context/AppContext';
import dynamic from 'next/dynamic';
import { reorderItems } from '@/utils/sectionItem';
import { useEditableContent } from '@/hooks/useEditableContent';

// Disables loading react-beautiful-dnd modules in the SSR mode
// to fix `data-rbd-draggable-context-id` did not match
const DragDropContext = dynamic(
  () =>
    import('react-beautiful-dnd').then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false },
);

interface Props {}

export const SectionList: FC<Props> = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { sections, setSections } = useAppContext();
  const {
    name: newSectionName,
    setName: setNewSectionName,
    openAdd: openAddNewSection,
  } = useEditableContent();

  const onRenameSection = (sectionId: string, value: string) => {
    const newSections = renameSection(sections, sectionId, value);

    setSections(newSections);
  };

  const onRemoveSection = (sectionId: string) => {
    const newSections = removeSection(sections, sectionId);

    setSections(newSections);
  };

  const onAddNewSection = (value: string) => {
    setNewSectionName(null);

    // Not to add new section if the name is empty
    if (!value) {
      return;
    }

    const newSections = addSection(sections, value);

    setSections(newSections);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return sections;
    }

    const modifiedSections = reorderItems(sections, result);

    setSections(modifiedSections);
  };

  // Pin scroll to the bottom
  useEffect(() => {
    if (listRef.current) {
      scrollToBottom(listRef.current);
    }
  }, [listRef, sections.length, newSectionName]);

  if (!sections?.length) {
    return <p className="text-sm">No section existed.</p>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="space-y-4"
        ref={listRef}
      >
        {sections.map((section) => (
          <Section
            key={section.id}
            section={section}
            onChangeTitle={onRenameSection}
            onRemoveSection={onRemoveSection}
          />
        ))}

        {typeof newSectionName === 'string' ? (
          <EditableAccordion
            title={newSectionName}
            defaultEditing
            onChangeTitle={onAddNewSection}
          />
        ) : null}

        <div className="sticky bottom-0 bg-white pb-4 pt-1.5">
          <Button
            variant={ButtonVariant.DASHED}
            onClick={openAddNewSection}
            className="w-full"
          >
            Add section
          </Button>
        </div>
      </div>
    </DragDropContext>
  );
};
