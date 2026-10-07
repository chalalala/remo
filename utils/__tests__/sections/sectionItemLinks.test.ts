import { Section } from '@/types/Resource';
import { getSelfHostedFavicon } from '@/utils/apis/getSelfHostedFavicon';
import { addItem, addItems, getFallbackFavicon } from '@/utils/sections/sectionItem';

jest.mock('utils/apis/getSelfHostedFavicon.ts', () => ({
  getSelfHostedFavicon: jest.fn(),
}));

describe('addItem with a link', () => {
  const sections: Section[] = [{ id: '1', name: 'Section 1', items: [] }];

  it('should use the given link and icon', async () => {
    const newSections = await addItem(sections, '1', 'Docs', {
      url: 'https://docs.example.com',
      icon: 'https://docs.example.com/icon.png',
    });

    expect(newSections[0].items).toEqual([
      {
        id: expect.any(String),
        name: 'Docs',
        url: 'https://docs.example.com',
        icon: 'https://docs.example.com/icon.png',
      },
    ]);
  });

  it('should look up the favicon when the link has no icon', async () => {
    (getSelfHostedFavicon as jest.Mock).mockResolvedValue('https://docs.example.com/favicon.ico');

    const newSections = await addItem(sections, '1', 'Docs', { url: 'https://docs.example.com' });

    expect(newSections[0].items[0].icon).toBe('https://docs.example.com/favicon.ico');
  });
});

describe('addItems', () => {
  const sections: Section[] = [
    {
      id: '1',
      name: 'Section 1',
      items: [{ id: 'item1', name: 'Saved', icon: '', url: 'https://saved.com' }],
    },
  ];

  it('should add new links at the top in order, skipping saved and repeated links', () => {
    const { sections: newSections, addedCount } = addItems(sections, '1', [
      { name: 'A', url: 'https://a.com', icon: 'a.png' },
      { name: 'Saved again', url: 'https://saved.com' },
      { name: '', url: 'https://b.com' },
      { name: 'A again', url: 'https://a.com' },
      { name: 'Empty', url: '' },
    ]);

    expect(addedCount).toBe(2);
    expect(newSections[0].items).toEqual([
      { id: expect.stringMatching(/^item_/), name: 'A', url: 'https://a.com', icon: 'a.png' },
      {
        id: expect.stringMatching(/^item_/),
        name: 'https://b.com',
        url: 'https://b.com',
        icon: getFallbackFavicon('https://b.com'),
      },
      sections[0].items[0],
    ]);
    expect(newSections[0].items[0].id).not.toBe(newSections[0].items[1].id);
  });

  it('should return the same sections when nothing is new', () => {
    const result = addItems(sections, '1', [{ name: 'Saved', url: 'https://saved.com' }]);

    expect(result).toEqual({ sections, addedCount: 0 });
  });

  it('should return the same sections when the section does not exist', () => {
    const result = addItems(sections, 'missing', [{ name: 'A', url: 'https://a.com' }]);

    expect(result).toEqual({ sections, addedCount: 0 });
  });
});
