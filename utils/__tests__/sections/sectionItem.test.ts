import { Section } from '@/types/Resource';
import { getSelfHostedFavicon } from '@/utils/apis/getSelfHostedFavicon';
import {
  addItem,
  getFaviconFromURL,
  removeItem,
  reorderItems,
  updateItem,
} from '@/utils/sections/sectionItem';
import { DropResult } from 'react-beautiful-dnd';

jest.mock('utils/apis/getSelfHostedFavicon.ts', () => ({
  getSelfHostedFavicon: jest.fn(),
}));

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

  it('should add a new item to the section with the given ID', async () => {
    const newSections = await addItem(sections, '1', 'New Item');

    expect(newSections).toEqual([
      {
        id: '1',
        name: 'Section 1',
        items: [
          {
            id: expect.any(String),
            name: 'New Item',
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

  it('should return the original list if section ID is not found', async () => {
    const newSections = await addItem(sections, 'not found', 'New Item');

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

describe('updateItem', () => {
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

  it('should update the item with the given ID', () => {
    const section = sections[0];
    const newSections = updateItem(sections, section.id, section.items[0].id, {
      url: 'test',
    });

    expect(newSections).toEqual([
      {
        id: '1',
        name: 'Section 1',
        items: [
          {
            id: 'item1',
            name: 'Item 1',
            icon: '',
            url: 'test',
          },
        ],
      },
    ]);
  });

  it('should return the original list if section ID is not found', () => {
    const newSections = updateItem(sections, 'not-found', 'item1', { url: 'test' });

    expect(newSections).toEqual(sections);
  });

  it('should return the original list if item ID is not found', () => {
    const newSections = updateItem(sections, '1', 'not-found', { url: 'test' });

    expect(newSections).toEqual(sections);
  });
});

describe('getFaviconFromURL', () => {
  it('should return self hosted url if it is valid', async () => {
    (getSelfHostedFavicon as jest.Mock).mockResolvedValue('test');

    expect(await getFaviconFromURL('https://example.com')).toBe('test');
  });

  it('should return fallback url if self host url is invalid', async () => {
    (getSelfHostedFavicon as jest.Mock).mockResolvedValue('');

    expect(await getFaviconFromURL('https://example.com')).toBe(
      'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://example.com&size=32',
    );
  });
});
