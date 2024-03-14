import { Space } from '@/types/Resource';
import { generateId } from '../string';

export const createNewSpace = (spaces: Space[], name: string) => {
  let id = generateId();

  // Generate a new ID if the ID already exists
  while (spaces.some((section) => section.id === id)) {
    id = generateId();
  }

  const newSpace = {
    id: `space_${id}`,
    name,
    sections: [],
  };

  return newSpace;
};

export const renameSpace = (spaces: Space[], spaceId: string, value: string) => {
  const newSpaces = spaces.map((space) => {
    if (space.id === spaceId) {
      return {
        ...space,
        name: value,
      };
    }

    return space;
  });

  return newSpaces;
};

export const removeSpace = (spaces: Space[], spaceId: string) => {
  return spaces.filter((space) => space.id !== spaceId);
};
