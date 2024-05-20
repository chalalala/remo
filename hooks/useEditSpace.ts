import { useAppContext } from '@/context/AppContext';
import { useRemoteData } from './useRemoteData';
import { useCallback } from 'react';
import { removeSpace, renameSpace } from '@/utils/sections/space';
import { removeSection, renameSection, reorderSections } from '@/utils/sections/sectionList';
import { DropResult } from 'react-beautiful-dnd';

export const useEditSpace = () => {
  const { spaces, sections, selectedSpace, accessToken, setSections } = useAppContext();
  const { isLoading, mutate } = useRemoteData(accessToken);

  const onRemoveSpace = useCallback(() => {
    if (isLoading) {
      return;
    }

    const newSpaces = removeSpace(spaces, selectedSpace?.id || '');

    mutate(newSpaces);
  }, [isLoading, spaces, selectedSpace, mutate]);

  const onRenameSpace = useCallback(
    (name: string) => {
      if (isLoading) {
        return;
      }

      const newSpaces = renameSpace(spaces, selectedSpace?.id || '', name);

      mutate(newSpaces);
    },
    [isLoading, spaces, selectedSpace, mutate],
  );

  const onRemoveSection = useCallback(
    (sectionId: string) => {
      const newSections = removeSection(sections, sectionId);

      setSections(newSections);
    },
    [sections, setSections],
  );

  const onRenameSection = useCallback(
    (sectionId: string, sectionName: string, value: string) => {
      if (sectionName === value) {
        return;
      }

      const newSections = renameSection(sections, sectionId, value);

      setSections(newSections);
    },
    [sections, setSections],
  );

  const onReorderSections = useCallback(
    (result: DropResult) => {
      const newSections = reorderSections(sections, result);

      setSections(newSections);
    },
    [sections, setSections],
  );

  return { onRemoveSpace, onRenameSpace, onRemoveSection, onRenameSection, onReorderSections };
};
