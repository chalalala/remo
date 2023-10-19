import { Section } from '@/types/Resource';
import { generateId } from './string';

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
