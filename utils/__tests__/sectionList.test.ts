import { Section } from '@/types/Resource';
import { addSection, renameSection, reorderItems } from '../sectionList';
import { DropResult } from 'react-beautiful-dnd';

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
describe('reorderItems', () => {
  it('should reorder items within the same section', () => {
    const sections: Section[] = [
      {
        id: '1',
        name: 'Section 1',
        items: [
          {
            id: 'item1',
            name: 'Item 1',
            icon: '',
            url: '',
          },
          {
            id: 'item2',
            name: 'Item 2',
            icon: '',
            url: '',
          },
        ],
      },
    ];

    const dropResult = {
      source: { droppableId: '1', index: 0 },
      destination: { droppableId: '1', index: 1 },
    } as DropResult;

    const newSections = reorderItems(sections, dropResult);

    expect(newSections).toEqual([
      {
        id: '1',
        name: 'Section 1',
        items: [
          {
            id: 'item2',
            name: 'Item 2',
            icon: '',
            url: '',
          },
          {
            id: 'item1',
            name: 'Item 1',
            icon: '',
            url: '',
          },
        ],
      },
    ]);
  });

  it('should move an item to a different section', () => {
    const sections = [
      {
        id: '1',
        name: 'Section 1',
        items: [
          {
            id: 'item1',
            name: 'Item 1',
            icon: '',
            url: '',
          },
          {
            id: 'item2',
            name: 'Item 2',
            icon: '',
            url: '',
          },
        ],
      },
      {
        id: '2',
        name: 'Section 2',
        items: [
          {
            id: 'item3',
            name: 'Item 3',
            icon: '',
            url: '',
          },
        ],
      },
    ];

    const dropResult = {
      source: { droppableId: '1', index: 1 },
      destination: { droppableId: '2', index: 0 },
    } as DropResult;

    const newSections = reorderItems(sections, dropResult);

    expect(newSections).toEqual([
      {
        id: '1',
        name: 'Section 1',
        items: [{ id: 'item1', name: 'Item 1', icon: '', url: '' }],
      },
      {
        id: '2',
        name: 'Section 2',
        items: [
          {
            id: 'item2',
            name: 'Item 2',
            icon: '',
            url: '',
          },
          {
            id: 'item3',
            name: 'Item 3',
            icon: '',
            url: '',
          },
        ],
      },
    ]);
  });

  it('should return the original list if destination is null', () => {
    const sections = [
      {
        id: '1',
        name: 'Section 1',
        items: [
          {
            id: 'item1',
            name: 'Item 1',
            icon: '',
            url: '',
          },
          {
            id: 'item2',
            name: 'Item 2',
            icon: '',
            url: '',
          },
        ],
      },
    ];

    const dropResult = {
      source: { droppableId: '1', index: 1 },
      destination: null,
    } as DropResult;

    const newSections = reorderItems(sections, dropResult);

    expect(newSections).toEqual(sections);
  });
});
