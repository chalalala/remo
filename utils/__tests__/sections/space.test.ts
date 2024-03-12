import { createNewSpace } from '@/utils/sections/space';

describe('createNewSpace', () => {
  it('should create a new space', () => {
    const mockSpaces = [
      {
        id: '1',
        name: 'Section 1',
        sections: [],
      },
    ];

    const newSection = createNewSpace(mockSpaces, 'Section 2');

    expect(newSection).toEqual({
      id: expect.any(String),
      name: 'Section 2',
      sections: [],
    });
  });
});
