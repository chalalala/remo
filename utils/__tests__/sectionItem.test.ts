import { Section } from '@/types/Resource';
import { addItem, reorderItems } from '../sectionItem';
import { DropResult } from 'react-beautiful-dnd';

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

describe('addItem', () => {
  it('should add a new item to the section with the given ID', () => {
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
        ],
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
        ],
      },
    ];

    const newSections = addItem(sections, '1', 'New Item');

    expect(newSections).toEqual([
      {
        id: '1',
        name: 'Section 1',
        items: [
          {
            id: expect.any(String),
            name: 'New Item',
            icon: '',
            url: window.location.href,
          },
          {
            id: 'item1',
            name: 'Item 1',
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
            id: 'item2',
            name: 'Item 2',
            icon: '',
            url: '',
          },
        ],
      },
    ]);
  });

  it('should return the original list if section ID is not found', () => {
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
        ],
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
        ],
      },
    ];

    const newSections = addItem(sections, '3', 'New Item');

    expect(newSections).toEqual(sections);
  });
});
