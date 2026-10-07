import { Space } from '@/types/Resource';
import { restoreItem, restoreSection, restoreSpace } from '@/utils/sections/restore';

const item = (id: string) => ({ id, name: `Item ${id}`, icon: '', url: `https://${id}.com` });

const mockSpaces = (): Space[] => [
  {
    id: 'space1',
    name: 'Space 1',
    sections: [
      { id: 'section1', name: 'Section 1', items: [item('a'), item('c')] },
      { id: 'section3', name: 'Section 3', items: [] },
    ],
  },
  { id: 'space3', name: 'Space 3', sections: [] },
];

describe('restoreSpace', () => {
  it('should put the space back at its index', () => {
    const space = { id: 'space2', name: 'Space 2', sections: [] };

    expect(restoreSpace(mockSpaces(), space, 1).map(({ id }) => id)).toEqual([
      'space1',
      'space2',
      'space3',
    ]);
  });

  it('should append the space when the index is past the end', () => {
    const space = { id: 'space2', name: 'Space 2', sections: [] };

    expect(restoreSpace(mockSpaces(), space, 10).map(({ id }) => id)).toEqual([
      'space1',
      'space3',
      'space2',
    ]);
  });

  it('should not add the space twice', () => {
    const spaces = mockSpaces();

    expect(restoreSpace(spaces, spaces[0], 0)).toBe(spaces);
  });
});

describe('restoreSection', () => {
  it('should put the section back into its space at its index', () => {
    const section = { id: 'section2', name: 'Section 2', items: [] };
    const result = restoreSection(mockSpaces(), 'space1', section, 1);

    expect(result[0].sections.map(({ id }) => id)).toEqual(['section1', 'section2', 'section3']);
    expect(result[1]).toEqual(mockSpaces()[1]);
  });

  it('should do nothing when the space no longer exists', () => {
    const section = { id: 'section2', name: 'Section 2', items: [] };

    expect(restoreSection(mockSpaces(), 'missing', section, 0)).toEqual(mockSpaces());
  });

  it('should not add the section twice', () => {
    const spaces = mockSpaces();

    expect(restoreSection(spaces, 'space1', spaces[0].sections[0], 0)).toEqual(mockSpaces());
  });
});

describe('restoreItem', () => {
  it('should put the item back into its section at its index', () => {
    const result = restoreItem(mockSpaces(), 'space1', 'section1', item('b'), 1);

    expect(result[0].sections[0].items.map(({ id }) => id)).toEqual(['a', 'b', 'c']);
  });

  it('should do nothing when the section no longer exists', () => {
    expect(restoreItem(mockSpaces(), 'space1', 'missing', item('b'), 0)).toEqual(mockSpaces());
  });

  it('should do nothing when the space no longer exists', () => {
    expect(restoreItem(mockSpaces(), 'missing', 'section1', item('b'), 0)).toEqual(mockSpaces());
  });

  it('should not add the item twice', () => {
    expect(restoreItem(mockSpaces(), 'space1', 'section1', item('a'), 0)).toEqual(mockSpaces());
  });
});
