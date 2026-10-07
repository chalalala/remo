import { SectionItem, Space } from '@/types/Resource';

export interface SearchResult {
  item: SectionItem;
  spaceId: string;
  spaceName: string;
  sectionName: string;
}

export const MAX_SEARCH_RESULTS = 50;

/**
 * Finds saved links in every space whose name or URL contains the query (case-insensitive).
 * Items without a URL are skipped because there is nothing to open.
 * @param spaces - All spaces to search in.
 * @param query - The text to look for.
 * @returns Matches in space, section and item order, at most `MAX_SEARCH_RESULTS`.
 */
export const searchItems = (spaces: Space[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  if (!normalizedQuery) {
    return results;
  }

  for (const space of spaces) {
    for (const section of space.sections) {
      for (const item of section.items) {
        if (!item.url) {
          continue;
        }

        const isMatched =
          item.name.toLowerCase().includes(normalizedQuery) ||
          item.url.toLowerCase().includes(normalizedQuery);

        if (isMatched) {
          results.push({
            item,
            spaceId: space.id,
            spaceName: space.name,
            sectionName: section.name,
          });
        }

        if (results.length >= MAX_SEARCH_RESULTS) {
          return results;
        }
      }
    }
  }

  return results;
};
