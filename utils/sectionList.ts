import { Section } from '@/types/Resource';

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
