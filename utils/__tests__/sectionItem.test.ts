import { Section } from '@/types/Resource';
import { addItem, removeItem, reorderItems } from '../sectionItem';
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
  ];

  it('should add a new item to the section with the given ID', () => {
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
    ]);
  });

  it('should return the original list if section ID is not found', () => {
    const newSections = addItem(sections, 'not found', 'New Item');

    expect(newSections).toEqual(sections);
  });
});

describe('removeItem', () => {
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
  ];

  it('should remove the item the given ID', () => {
    const section = sections[0];
    const newSections = removeItem(sections, section.id, section.items[0].id);

    expect(newSections).toEqual([
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
    ]);
  });

  it('should return the original list if section ID is not found', () => {
    const newSections = removeItem(sections, 'not-found', 'New Item');

    expect(newSections).toEqual(sections);
  });
});
