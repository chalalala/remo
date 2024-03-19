import { Section, SectionItem } from '@/types/Resource';
import { generateId } from '../string';
import { DropResult } from 'react-beautiful-dnd';
import { isExtension } from '../env';
import { getSelfHostedFavicon } from '../apis/getSelfHostedFavicon';

/**
 * Reorders the items in the sections array based on the provided drop result.
 * @param sections - The array of sections to reorder.
 * @param dropResult - The result of the drag and drop operation.
 * @returns A new array of sections with the items reordered based on the drop result.
 */
export const reorderItems = (sections: Section[], dropResult: DropResult) => {
  if (!dropResult.destination) {
    return sections;
  }

  const modifiedSections: Section[] = JSON.parse(JSON.stringify(sections));

  const sourceSectionIdx = modifiedSections.findIndex(
    (section) => section.id === dropResult.source.droppableId,
  );
  const destinationSectionIdx = modifiedSections.findIndex(
    (section) => section.id === dropResult.destination?.droppableId,
  );

  const draggedItem = modifiedSections[sourceSectionIdx].items.splice(
    dropResult.source.index,
    1,
  )?.[0];

  modifiedSections[destinationSectionIdx].items.splice(
    dropResult.destination.index,
    0,
    draggedItem,
  );

  return modifiedSections;
};

export const addItem = async (sections: Section[], sectionId: string, name: string) => {
  const sectionIdx = sections.findIndex((section) => section.id === sectionId);

  if (sectionIdx === -1) {
    return sections;
  }

  const items = sections[sectionIdx].items;
  let id = generateId();

  // Generate a new ID if the ID already exists
  while (items.some((item) => item.id === id)) {
    id = generateId();
  }

  const newItem: SectionItem = {
    id: `item_${id}`,
    name,
    icon: '',
    url: '',
  };

  if (isExtension()) {
    const queryOptions = { active: true, currentWindow: true };

    const [tab] = await chrome.tabs.query(queryOptions);

    const url = tab?.url || '';

    newItem.url = url;
    newItem.icon = await getFaviconFromURL(url);
  }

  const newSections = JSON.parse(JSON.stringify(sections));

  newSections.splice(sectionIdx, 1, {
    ...sections[sectionIdx],
    items: [newItem, ...items],
  });

  return newSections;
};

export const removeItem = (sections: Section[], sectionId: string, itemId: string) => {
  const sectionIdx = sections.findIndex((section) => section.id === sectionId);

  if (sectionIdx === -1) {
    return sections;
  }

  const items = sections[sectionIdx].items;

  const newSections = JSON.parse(JSON.stringify(sections));

  newSections.splice(sectionIdx, 1, {
    ...sections[sectionIdx],
    items: items.filter((item) => item.id !== itemId),
  });

  return newSections;
};

export const updateItem = (
  sections: Section[],
  sectionId: string,
  itemId: string,
  property: Record<string, unknown>,
) => {
  const sectionIdx = sections.findIndex((section) => section.id === sectionId);

  if (sectionIdx === -1) {
    return sections;
  }

  const itemIdx = sections[sectionIdx].items.findIndex((item) => item.id === itemId);

  if (itemIdx === -1) {
    return sections;
  }

  const newSections = JSON.parse(JSON.stringify(sections));

  newSections[sectionIdx].items[itemIdx] = {
    ...newSections[sectionIdx].items[itemIdx],
    ...property,
  };

  return newSections;
};

export const getFaviconFromURL = async (url: string) => {
  const selfHostedFavicon = await getSelfHostedFavicon(url);

  if (selfHostedFavicon) {
    return selfHostedFavicon;
  }

  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=32`;
};
