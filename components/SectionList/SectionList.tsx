import { FC, useState } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { renameSection } from '@/utils/sectionList';
import { Section } from '@/types/Resource';
import { Button, ButtonVariant } from '../Button';

interface Props {}

export const SectionList: FC<Props> = () => {
  const [sections, setSections] = useState<Section[]>(() => [
    {
      id: 'test',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [],
    },
    {
      id: 'test',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [],
    },
    {
      id: 'test',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [],
    },
    {
      id: 'test',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [],
    },
    {
      id: 'test',
      name: 'Item with a very very very very very very very very very very very very long name',
      items: [],
    },
  ]);

  const onChange = (sectionId: string, value: string) => {
    const newSections = renameSection(sections, sectionId, value);

    setSections(newSections);
  };

  if (!sections?.length) {
    return <p className="text-sm">No section existed.</p>;
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <EditableAccordion
          key={section.id}
          title={section.name}
          onChangeTitle={(newTitle) => onChange(section.id, newTitle)}
        >
          <div className="mt-2.5">Content</div>
        </EditableAccordion>
      ))}

      <div className="sticky bottom-0 bg-white py-4">
        <Button
          variant={ButtonVariant.DASHED}
          className="w-full"
        >
          Add section
        </Button>
      </div>
    </div>
  );
};
