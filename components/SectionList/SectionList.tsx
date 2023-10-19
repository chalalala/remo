import { FC, useEffect, useRef, useState } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { Section as SectionType } from '@/types/Resource';
import { Button, ButtonVariant } from '../Button';
import { scrollToBottom } from '@/utils/dom';
import { Section } from '../Section';
import { DropResult } from 'react-beautiful-dnd';
import { addSection, renameSection } from '@/utils/sectionList';
import { useAppContext } from '@/context/AppContext';
import dynamic from 'next/dynamic';

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
  const [newSectionName, setNewSectionName] = useState<string | null>(null);

  const openAddNewSection = () => {
    setNewSectionName('');
  };

  const onRenameSection = (sectionId: string, value: string) => {
    const newSections = renameSection(sections, sectionId, value);

    setSections(newSections);
  };

  const onChangeNewSection = (value: string) => {
    setNewSectionName(null);

    // Not to add new section if the name is empty
    if (!value) {
      return;
    }

    const newSections = addSection(sections, value);

    setSections(newSections);
  };

  const onDragEnd = (result: DropResult) => {
    const modifiedSections: SectionType[] = JSON.parse(JSON.stringify(sections));

    if (!result.destination) {
      return;
    }

    const sourceSectionIdx = modifiedSections.findIndex(
      (section) => section.id === result.source.droppableId,
    );
    const destinationSectionIdx = modifiedSections.findIndex(
      (section) => section.id === result.destination?.droppableId,
    );

    const draggedItem = modifiedSections[sourceSectionIdx].items.splice(
      result.source.index,
      1,
    )?.[0];

    modifiedSections[destinationSectionIdx].items.splice(result.destination.index, 0, draggedItem);

    setSections(modifiedSections);
  };

  // Pin scroll to the bottom
  useEffect(() => {
    if (listRef.current) {
      scrollToBottom(listRef.current);
    }
  }, [listRef, sections, newSectionName]);

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
          />
        ))}

        {typeof newSectionName === 'string' ? (
          <EditableAccordion
            title={newSectionName}
            defaultEditing
            onChangeTitle={onChangeNewSection}
          />
        ) : null}

        <div className="sticky bottom-0 bg-white py-4">
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
