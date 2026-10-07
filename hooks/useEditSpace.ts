import { useAppContext } from '@/context/AppContext';
import { useRemoteData } from './useRemoteData';
import { useCallback } from 'react';
import { renameSpace } from '@/utils/sections/space';
import { renameSection, reorderSections } from '@/utils/sections/sectionList';
import { useRemoveWithUndo } from './useRemoveWithUndo';
import { DropResult } from 'react-beautiful-dnd';

export const useEditSpace = () => {
  const { spaces, sections, selectedSpace, accessToken, setSections } = useAppContext();
  const { isLoading, mutate } = useRemoteData(accessToken);

  const { removeSpace: onRemoveSpace, removeSection: onRemoveSection } = useRemoveWithUndo();

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
