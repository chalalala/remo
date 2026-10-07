import { Space } from '@/types/Resource';
import { MAX_SEARCH_RESULTS, searchItems } from '@/utils/sections/search';

const spaces: Space[] = [
  {
    id: 'work',
    name: 'Work',
    sections: [
      {
        id: 'docs',
        name: 'Docs',
        items: [
          { id: '1', name: 'Design spec', icon: '', url: 'https://docs.example.com/spec' },
          { id: '2', name: 'No link yet', icon: '', url: '' },
        ],
      },
    ],
  },
  {
    id: 'home',
    name: 'Home',
    sections: [
      {
        id: 'recipes',
        name: 'Recipes',
        items: [{ id: '3', name: 'Pho', icon: '', url: 'https://food.example.com/pho' }],
      },
    ],
  },
];

describe('searchItems', () => {
  it('should return nothing for an empty query', () => {
    expect(searchItems(spaces, '   ')).toEqual([]);
  });

  it('should match names case-insensitively and include where the item lives', () => {
    expect(searchItems(spaces, 'SPEC')).toEqual([
      {
        item: spaces[0].sections[0].items[0],
        spaceId: 'work',
        spaceName: 'Work',
        sectionName: 'Docs',
      },
    ]);
  });

  it('should match URLs across spaces', () => {
    expect(searchItems(spaces, 'example.com').map(({ item }) => item.id)).toEqual(['1', '3']);
  });

  it('should skip items without a URL', () => {
    expect(searchItems(spaces, 'no link')).toEqual([]);
  });

  it('should stop at the result limit', () => {
    const manyItems = Array.from({ length: MAX_SEARCH_RESULTS + 5 }, (_, index) => ({
      id: `${index}`,
      name: `Link ${index}`,
      icon: '',
      url: `https://example.com/${index}`,
    }));
    const bigSpace: Space = {
      id: 'big',
      name: 'Big',
      sections: [{ id: 's', name: 'S', items: manyItems }],
    };

    expect(searchItems([bigSpace], 'link')).toHaveLength(MAX_SEARCH_RESULTS);
  });
});
