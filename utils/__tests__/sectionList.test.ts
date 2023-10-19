import { addSection, renameSection } from '../sectionList';

describe('renameSection', () => {
  it('should rename the section with the given ID', () => {
    const mockSections = [
      {
        id: 'test',
        name: 'Old Name',
        items: [],
      },
    ];

    const newSections = renameSection(mockSections, 'test', 'New Name');

    expect(newSections).toEqual([
      {
        id: 'test',
        name: 'New Name',
        items: [],
      },
    ]);
  });

  it('should return original list if section ID is not found', () => {
    const mockSections = [
      {
        id: 'test',
        name: 'Old Name',
        items: [],
      },
    ];

    const newSections = renameSection(mockSections, 'not-exists', 'New Name');

    expect(newSections).toEqual(mockSections);
  });
});

describe('addSection', () => {
  it('should add a new section to the list', () => {
    const mockSections = [
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
    ];

    const newSections = addSection(mockSections, 'Section 2');

    expect(newSections).toEqual([
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
      {
        id: expect.any(String),
        name: 'Section 2',
        items: [],
      },
    ]);
  });
});
