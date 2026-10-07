import { FC, useEffect, useState } from 'react';
import { ActiveTabData, clearPendingItem, getPendingItem } from '@/lib/chromeApi';
import { useAppContext } from '@/context/AppContext';
import { addItem } from '@/utils/sections/sectionItem';
import { Button, ButtonVariant } from '../Button';
import { toast } from '../ui/use-toast';

/**
 * Shows the page or link queued from the right-click menu or keyboard shortcut,
 * and lets the user pick the section to save it into.
 */
export const PendingItemBanner: FC = () => {
  const { sections, selectedSpace, isLoading, setSections } = useAppContext();
  const [pendingItem, setPendingItem] = useState<ActiveTabData>();
  const [sectionId, setSectionId] = useState('');

  useEffect(() => {
    getPendingItem().then(setPendingItem);
  }, []);

  useEffect(() => {
    if (!sections.some(({ id }) => id === sectionId)) {
      setSectionId(sections[0]?.id || '');
    }
  }, [sections, sectionId]);

  if (!pendingItem || !selectedSpace) {
    return null;
  }

  const dismiss = async () => {
    setPendingItem(undefined);
    await clearPendingItem();
  };

  const save = async () => {
    const section = sections.find(({ id }) => id === sectionId);

    if (isLoading || !section) {
      return;
    }

    const newSections = await addItem(sections, section.id, pendingItem.title || pendingItem.url, {
      url: pendingItem.url,
      icon: pendingItem.icon,
    });

    setSections(newSections);
    toast({ title: `Saved to "${section.name}"` });
    await dismiss();
  };

  return (
    <div
      className="mb-4 space-y-2 rounded bg-indigo-50 p-3 text-sm"
      role="region"
      aria-label="Save to Remo"
    >
      <p className="truncate">
        Save <span className="font-medium">{pendingItem.title || pendingItem.url}</span>
      </p>

      {sections.length ? (
        <div className="flex items-center gap-2">
          <select
            aria-label="Section"
            className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-2 py-1"
            value={sectionId}
            onChange={(event) => setSectionId(event.target.value)}
          >
            {sections.map((section) => (
              <option
                key={section.id}
                value={section.id}
              >
                {section.name}
              </option>
            ))}
          </select>
          <Button onClick={save}>Save</Button>
          <Button
            variant={ButtonVariant.DASHED}
            onClick={dismiss}
          >
            Dismiss
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2">
          <p className="text-gray-600">Add a section to this space first.</p>
          <Button
            variant={ButtonVariant.DASHED}
            onClick={dismiss}
          >
            Dismiss
          </Button>
        </div>
      )}
    </div>
  );
};
