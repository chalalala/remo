import { FC, useEffect, useMemo, useRef } from 'react';
import { EditableAccordion } from '../EditableAccordion';
import { Button, ButtonVariant } from '../Button';
import { scrollToBottom } from '@/utils/dom';
import { Section } from '../Section';
import { DropResult } from 'react-beautiful-dnd';
import { useAppContext } from '@/context/AppContext';
import dynamic from 'next/dynamic';
import { useEditableContent } from '@/hooks/useEditableContent';
import { Loader } from '../Loader';
import { useDatabaseQuery } from '@/hooks/useDatabaseQuery';
import { sqlQuery } from '@/constants/queries';
import { Section as ISection, SectionItem } from '@/types/Resource';
import { useRemoteData } from '@/hooks/useRemoteData';

// Disables loading react-beautiful-dnd modules in the SSR mode
// to fix `data-rbd-draggable-context-id` did not match
const DragDropContext = dynamic(
  () =>
    import('react-beautiful-dnd').then((mod) => {
      return mod.DragDropContext;
    }),
  { ssr: false },
);

interface Props {}

export const SectionList: FC<Props> = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { db, accessToken, isLoading, selectedSpaceId } = useAppContext();
  const { getQueryResultAsJson } = useDatabaseQuery();
  const { mutate } = useRemoteData(accessToken);
  const sections = useMemo(() => {
    return selectedSpaceId
      ? getQueryResultAsJson<ISection>(sqlQuery.SELECT_SECTIONS, {
          ':spaceId': selectedSpaceId,
        })
      : [];
  }, [selectedSpaceId, getQueryResultAsJson]);

  const {
    name: newSectionName,
    setName: setNewSectionName,
    openAdd: openAddNewSection,
  } = useEditableContent();

  const onRenameSection = (sectionId: string, value: string) => {
    if (!db) {
      return;
    }

    db.exec(sqlQuery.RENAME_SECTION, {
      ':name': value,
      ':sectionId': sectionId,
    });

    mutate(db.export().buffer);
  };

  const onRemoveSection = (sectionId: string) => {
    if (!db) {
      return;
    }

    db.exec(sqlQuery.DELETE_SECTION, {
      ':sectionId': sectionId,
    });

    mutate(db.export().buffer);
  };

  const onAddNewSection = (value: string) => {
    setNewSectionName(null);

    // Not to add new section if the name is empty
    if (!value || !db) {
      return;
    }

    db.exec(sqlQuery.INSERT_SECTION, {
      ':name': value,
      ':spaceId': selectedSpaceId,
    });

    mutate(db.export().buffer);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !db) {
      return;
    }

    const { index: sourceIdx, droppableId: sourceSection } = result.source;
    const { index: targetIdx, droppableId: targetSection } = result.destination;

    const [sourceItem] = getQueryResultAsJson<SectionItem>(
      sqlQuery.GET_SECTION_ITEM_SOURCE_BY_INDEX,
      {
        ':sectionId': sourceSection,
        ':index': sourceIdx,
      },
    );

    const [targetItem] = getQueryResultAsJson<SectionItem | undefined>(
      sqlQuery.GET_SECTION_ITEM_SOURCE_BY_INDEX,
      {
        ':sectionId': targetSection,
        ':index': targetIdx,
      },
    );

    if (sourceSection !== targetSection) {
      db.exec(sqlQuery.CHANGE_SECTION_WITH_ITEM_SEQ, {
        ':sectionItemSeq': sourceItem.seq,
        ':sourceSection': sourceSection,
        ':targetSection': targetSection,
      });
    }

    // TODO: update seq of the source item after changing section

    db.exec(sqlQuery.REORDER_SECTION_ITEM, {
      ':sourceSeq': sourceItem.seq,
      ':targetSeq': targetItem?.seq || 0,
      ':sourceSection': sourceSection,
    });

    mutate(db.export().buffer);
  };

  // Pin scroll to the bottom
  useEffect(() => {
    if (listRef.current) {
      scrollToBottom(listRef.current);
    }
  }, [listRef, sections.length, newSectionName]);

  if (isLoading && !sections.length) {
    return <Loader />;
  }

  if (!selectedSpaceId) {
    return (
      <p className="text-sm font-medium leading-normal">
        No space selected. Add or select a space to get started ☝️
      </p>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="space-y-4"
        ref={listRef}
      >
        {sections.map((section) => (
          <Section
            key={section.id}
            section={section}
            onChangeTitle={onRenameSection}
            onRemoveSection={onRemoveSection}
          />
        ))}

        {typeof newSectionName === 'string' ? (
          <EditableAccordion
            title={newSectionName}
            defaultEditing
            onChangeTitle={onAddNewSection}
          />
        ) : null}

        <div className="sticky bottom-0 bg-white pb-4 pt-1.5">
          <Button
            variant={ButtonVariant.DASHED}
            onClick={openAddNewSection}
            className="w-full"
          >
            Add section
          </Button>
        </div>
      </div>
    </DragDropContext>
  );
};
