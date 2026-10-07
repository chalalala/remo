import { FC, useEffect, useMemo, useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { Dialog, DialogContent } from '../ui/dialog';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '../ui/command';
import { IconButton } from '../IconButton';
import { Image } from '../Image';
import { useAppContext } from '@/context/AppContext';
import { searchItems } from '@/utils/sections/search';
import { openUrls } from '@/lib/chromeApi';

const isTyping = (target: EventTarget | null) => {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
};

export const SearchDialog: FC = () => {
  const { spaces } = useAppContext();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchItems(spaces, query), [spaces, query]);

  // Open with Ctrl+K / Cmd+K anywhere, or "/" when not typing
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModifierShortcut = event.key === 'k' && (event.metaKey || event.ctrlKey);
      const isSlashShortcut = event.key === '/' && !isTyping(event.target);

      if (isModifierShortcut || isSlashShortcut) {
        event.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const onOpenChange = (value: boolean) => {
    setOpen(value);

    if (!value) {
      setQuery('');
    }
  };

  const onSelect = (url: string) => {
    openUrls([url]);
    onOpenChange(false);
  };

  return (
    <>
      <IconButton
        className="h-6 w-6 shrink-0"
        title="Search links (Ctrl+K)"
        aria-label="Search links"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </IconButton>

      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-w-[min(90vw,32rem)] overflow-hidden p-0 text-gray-900 shadow-lg">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search links in all spaces"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {query.trim() ? <CommandEmpty>No links found.</CommandEmpty> : null}

              {results.map(({ item, spaceId, spaceName, sectionName }) => (
                <CommandItem
                  key={`${spaceId}-${item.id}`}
                  value={`${spaceId}-${item.id}`}
                  onSelect={() => onSelect(item.url)}
                  // cmdk always sets data-disabled, so undo the disabled styles from the base item
                  className="cursor-pointer gap-2 aria-selected:bg-indigo-50 data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                >
                  <Image
                    src={item.icon || '/icons/earth.svg'}
                    alt=""
                    className="h-4 w-4 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {spaceName} / {sectionName} · {item.url}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};
