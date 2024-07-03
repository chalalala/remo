import { FC, FormEvent, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckIcon, LinkIcon } from '@heroicons/react/solid';
import { Section } from '@/types/Resource';
import { Image } from '../Image';
import { getFaviconFromURL, updateItem } from '@/utils/sections/sectionItem';
import { getDataFromActiveTab } from '@/lib/chromeApi';

interface Props {
  sections: Section[];
  setSections: (sections: Section[]) => void;
  title: string;
  sectionId?: string;
  itemId?: string;
  url?: string;
  icon?: string;
}

export const DraggableItemPopover: FC<Props> = ({
  sections,
  setSections,
  sectionId,
  itemId,
  url,
  icon,
  title,
}) => {
  const [inputValue, setInputValue] = useState(url);
  const [open, setOpen] = useState(false);

  if (!sectionId || !itemId) {
    return null;
  }

  const updateUrl = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newSections = updateItem(sections, sectionId, itemId, {
      url: inputValue,
      icon: await getFaviconFromURL(inputValue || ''),
    });

    setSections(newSections);
    setOpen(false);
  };

  const updateWithCurrentLink = async () => {
    const { url } = await getDataFromActiveTab();

    setInputValue(url);
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger className="shrink-0">
        {url ? (
          <Image
            src={icon || '/icons/earth.svg'}
            alt={title}
            className="h-4 w-4"
          />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-96 rounded border-none bg-indigo-50 py-2.5 shadow-md"
      >
        <form
          className="flex items-center gap-1"
          onSubmit={updateUrl}
        >
          <button
            type="button"
            onClick={updateWithCurrentLink}
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <input
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Add your link here"
            className="flex-1 bg-transparent focus:border-b focus:border-b-gray-700 focus:outline-none"
          />
          <button>
            <CheckIcon className="h-4 w-4" />
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
