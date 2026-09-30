import { useCallback } from 'react';
import { showActionToast } from '@/components/ui/action-toast';
import { localStorageKey } from '@/constants/local-storage';
import { useAppContext } from '@/context/AppContext';
import { removeSpace as removeSpaceFromList } from '@/utils/sections/space';
import { removeSection as removeSectionFromList } from '@/utils/sections/sectionList';
import { removeItem as removeItemFromSection } from '@/utils/sections/sectionItem';
import { restoreItem, restoreSection, restoreSpace } from '@/utils/sections/restore';

/**
 * Removes spaces, sections and items straight away and offers an "Undo" toast to put them back.
 */
export const useRemoveWithUndo = () => {
  const {
    spaces,
    sections,
    selectedSpace,
    isLoading,
    setSections,
    updateSpaces,
    setSelectedSpaceId,
  } = useAppContext();

  const removeSpace = useCallback(() => {
    if (isLoading || !selectedSpace) {
      return;
    }

    const space = selectedSpace;
    const index = spaces.findIndex(({ id }) => id === space.id);

    updateSpaces((currentSpaces) => removeSpaceFromList(currentSpaces, space.id));

    showActionToast({
      title: `Removed space "${space.name}"`,
      actionLabel: 'Undo',
      onAction: () => {
        updateSpaces((currentSpaces) => restoreSpace(currentSpaces, space, index));
        localStorage.setItem(localStorageKey.LAST_SPACE_ID, space.id);
        setSelectedSpaceId(space.id);
      },
    });
  }, [isLoading, selectedSpace, spaces, updateSpaces, setSelectedSpaceId]);

  const removeSection = useCallback(
    (sectionId: string) => {
      const index = sections.findIndex(({ id }) => id === sectionId);
      const section = sections[index];

      if (!selectedSpace || !section) {
        return;
      }

      const spaceId = selectedSpace.id;

      setSections(removeSectionFromList(sections, sectionId));

      showActionToast({
        title: `Removed section "${section.name}"`,
        actionLabel: 'Undo',
        onAction: () =>
          updateSpaces((currentSpaces) => restoreSection(currentSpaces, spaceId, section, index)),
      });
    },
    [sections, selectedSpace, setSections, updateSpaces],
  );

  const removeItem = useCallback(
    (sectionId: string, itemId: string) => {
      const items = sections.find(({ id }) => id === sectionId)?.items || [];
      const index = items.findIndex(({ id }) => id === itemId);
      const item = items[index];

      if (!selectedSpace || !item) {
        return;
      }

      const spaceId = selectedSpace.id;

      setSections(removeItemFromSection(sections, sectionId, itemId));

      showActionToast({
        title: `Removed "${item.name}"`,
        actionLabel: 'Undo',
        onAction: () =>
          updateSpaces((currentSpaces) =>
            restoreItem(currentSpaces, spaceId, sectionId, item, index),
          ),
      });
    },
    [sections, selectedSpace, setSections, updateSpaces],
  );

  return { removeSpace, removeSection, removeItem };
};
