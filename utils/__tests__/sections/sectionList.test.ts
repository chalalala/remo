import { Section } from '@/types/Resource';
import {
  addSection,
  removeSection,
  renameSection,
  reorderSections,
} from '@/utils/sections/sectionList';
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

describe('removeSection', () => {
  it('should remove the section with the given ID', () => {
    const mockSections = [
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
      {
        id: '2',
        name: 'Section 2',
        items: [],
      },
    ];

    const newSections = removeSection(mockSections, '1');

    expect(newSections).toEqual([
      {
        id: '2',
        name: 'Section 2',
        items: [],
      },
    ]);
  });

  it('should return original list if section ID is not found', () => {
    const mockSections = [
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
      {
        id: '2',
        name: 'Section 2',
        items: [],
      },
    ];

    const newSections = removeSection(mockSections, 'not-exists');

    expect(newSections).toEqual(mockSections);
  });

  it('should return an empty array if the input array is empty', () => {
    const mockSections: Section[] = [];

    const newSections = removeSection(mockSections, '1');

    expect(newSections).toEqual([]);
  });
});

describe('reorderSections', () => {
  it('should reorder the sections based on the drop result', () => {
    const mockSections = [
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
      {
        id: '2',
        name: 'Section 2',
        items: [],
      },
      {
        id: '3',
        name: 'Section 3',
        items: [],
      },
    ];

    const dropResult = {
      source: {
        index: 0,
      },
      destination: {
        index: 2,
      },
    } as DropResult;

    const newSections = reorderSections(mockSections, dropResult);

    expect(newSections).toEqual([
      {
        id: '2',
        name: 'Section 2',
        items: [],
      },
      {
        id: '3',
        name: 'Section 3',
        items: [],
      },
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
    ]);
  });

  it('should return the original sections if the drop result destination is not provided', () => {
    const mockSections = [
      {
        id: '1',
        name: 'Section 1',
        items: [],
      },
      {
        id: '2',
        name: 'Section 2',
        items: [],
      },
      {
        id: '3',
        name: 'Section 3',
        items: [],
      },
    ];

    const dropResult = {
      source: {
        index: 0,
      },
      destination: null,
    } as DropResult;

    const newSections = reorderSections(mockSections, dropResult);

    expect(newSections).toEqual(mockSections);
  });
});
