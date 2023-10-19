import { FC, useEffect, useRef, useState } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { addSection, renameSection } from '@/utils/sectionList';
import { Section } from '@/types/Resource';
import { Button, ButtonVariant } from '../Button';
import { scrollToBottom } from '@/utils/dom';

interface Props {}

export const SectionList: FC<Props> = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<Section[]>(() => [
    {
      id: 'test',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [],
    },
  ]);
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
    <div
      className="space-y-4"
      ref={listRef}
    >
      {sections.map((section) => (
        <EditableAccordion
          key={section.id}
          title={section.name}
          onChangeTitle={(newTitle) => onRenameSection(section.id, newTitle)}
        >
          <div className="mt-2.5">Content</div>
        </EditableAccordion>
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
  );
};
