import { createNewSpace, renameSpace, removeSpace } from '@/utils/sections/space';

describe('createNewSpace', () => {
  it('should create a new space', () => {
    const mockSpaces = [
      {
        id: '1',
        name: 'Section 1',
        sections: [],
      },
    ];

    const newSection = createNewSpace(mockSpaces, 'Section 2');

    expect(newSection).toEqual({
      id: expect.any(String),
      name: 'Section 2',
      sections: [],
    });
  });
});

describe('renameSpace', () => {
  it('should rename the space with the given id', () => {
    const mockSpaces = [
      {
        id: '1',
        name: 'Section 1',
        sections: [],
      },
      {
        id: '2',
        name: 'Section 2',
        sections: [],
      },
    ];

    const updatedSpaces = renameSpace(mockSpaces, '2', 'New Section Name');

    expect(updatedSpaces).toEqual([
      {
        id: '1',
        name: 'Section 1',
        sections: [],
      },
      {
        id: '2',
        name: 'New Section Name',
        sections: [],
      },
    ]);
  });

  it('should not modify the spaces if the given id is not found', () => {
    const mockSpaces = [
      {
        id: '1',
        name: 'Section 1',
        sections: [],
      },
      {
        id: '2',
        name: 'Section 2',
        sections: [],
      },
    ];

    const updatedSpaces = renameSpace(mockSpaces, '3', 'New Section Name');

    expect(updatedSpaces).toEqual(mockSpaces);
  });
});

describe('removeSpace', () => {
  it('should remove the space with the given id', () => {
    const mockSpaces = [
      {
        id: '1',
        name: 'Section 1',
        sections: [],
      },
      {
        id: '2',
        name: 'Section 2',
        sections: [],
      },
    ];

    const updatedSpaces = removeSpace(mockSpaces, '2');

    expect(updatedSpaces).toEqual([
      {
        id: '1',
        name: 'Section 1',
        sections: [],
      },
    ]);
  });

  it('should not modify the spaces if the given id is not found', () => {
    const mockSpaces = [
      {
        id: '1',
        name: 'Space 1',
        sections: [],
      },
      {
        id: '2',
        name: 'Space 2',
        sections: [],
      },
    ];

    const updatedSpaces = removeSpace(mockSpaces, '3');

    expect(updatedSpaces).toEqual(mockSpaces);
  });
});
