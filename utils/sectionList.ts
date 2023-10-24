import { Section } from '@/types/Resource';
import { generateId } from './string';
import { DropResult } from 'react-beautiful-dnd';

/**
 * Renames a section in the given array of sections.
 * @param sections - The array of sections to modify.
 * @param sectionId - The ID of the section to rename.
 * @param value - The new name for the section.
 * @returns A new array of sections with the renamed section.
 */
export const renameSection = (sections: Section[], sectionId: string, value: string) => {
  const newSections = sections.map((section) => {
    if (section.id === sectionId) {
      return {
        ...section,
        name: value,
      };
    }

    return section;
  });

  return newSections;
};

/**
 * Adds a new section to the list of sections.
 * @param sections - The list of sections to add the new section to.
 * @param name - The name of the new section.
 * @returns A new list of sections with the new section added.
 */
export const addSection = (sections: Section[], name: string) => {
  let id = generateId();

  // Generate a new ID if the ID already exists
  while (sections.some((section) => section.id === id)) {
    id = generateId();
  }

  const newSection = {
    id: `section_${id}`,
    name,
    items: [],
  };

  return [...sections, newSection];
};

/**
 * Reorders the items in the sections array based on the provided drop result.
 * @param sections - The array of sections to reorder.
 * @param dropResult - The result of the drag and drop operation.
 * @returns A new array of sections with the items reordered based on the drop result.
 */
export const reorderItems = (sections: Section[], dropResult: DropResult) => {
  if (!dropResult.destination) {
    return sections;
  }

  const modifiedSections: Section[] = JSON.parse(JSON.stringify(sections));

  const sourceSectionIdx = modifiedSections.findIndex(
    (section) => section.id === dropResult.source.droppableId,
  );
  const destinationSectionIdx = modifiedSections.findIndex(
    (section) => section.id === dropResult.destination?.droppableId,
  );

  const draggedItem = modifiedSections[sourceSectionIdx].items.splice(
    dropResult.source.index,
    1,
  )?.[0];

  modifiedSections[destinationSectionIdx].items.splice(
    dropResult.destination.index,
    0,
    draggedItem,
  );

  return modifiedSections;
};
