import { Section, SectionItem, Space } from '@/types/Resource';

/**
 * Inserts a value into a copy of the list at the given index, clamped to the list bounds.
 */
const insertAt = <T>(list: T[], value: T, index: number) => {
  const newList = [...list];
  const safeIndex = Math.max(0, Math.min(index, newList.length));

  newList.splice(safeIndex, 0, value);

  return newList;
};

/**
 * Puts a removed space back at its original position.
 * Does nothing if a space with the same ID already exists.
 */
export const restoreSpace = (spaces: Space[], space: Space, index: number) => {
  if (spaces.some(({ id }) => id === space.id)) {
    return spaces;
  }

  return insertAt(spaces, space, index);
};

/**
 * Puts a removed section back into its space at its original position.
 * Does nothing if the space no longer exists or the section is already there.
 */
export const restoreSection = (
  spaces: Space[],
  spaceId: string,
  section: Section,
  index: number,
) => {
  return spaces.map((space) => {
    if (space.id !== spaceId || space.sections.some(({ id }) => id === section.id)) {
      return space;
    }

    return {
      ...space,
      sections: insertAt<Section>(space.sections, section, index),
    };
  });
};

/**
 * Puts a removed item back into its section at its original position.
 * Does nothing if the space or section no longer exists or the item is already there.
 */
export const restoreItem = (
  spaces: Space[],
  spaceId: string,
  sectionId: string,
  item: SectionItem,
  index: number,
) => {
  return spaces.map((space) => {
    if (space.id !== spaceId) {
      return space;
    }

    return {
      ...space,
      sections: space.sections.map((section) => {
        if (section.id !== sectionId || section.items.some(({ id }) => id === item.id)) {
          return section;
        }

        return {
          ...section,
          items: insertAt<SectionItem>(section.items, item, index),
        };
      }),
    };
  });
};
