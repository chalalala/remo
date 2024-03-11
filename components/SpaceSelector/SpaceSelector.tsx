import React, { FC, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/solid';
import { CommandInput } from 'cmdk';
import { useAppContext } from '@/context/AppContext';
import { useRemoteData } from '@/hooks/useRemoteData';
import { createNewSpace } from '@/utils/sections/space';
import { localStorageKey } from '@/constants/local-storage';

interface Props {
  className?: string;
}

export const SpaceSelector: FC<Props> = ({ className }) => {
  const { accessToken, selectedSpace, setSelectedSpaceId } = useAppContext();
  const { spaces, mutate } = useRemoteData(accessToken);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocus, setIsInputFocus] = useState(false);

  useEffect(() => {
    setValue(selectedSpace?.name || '');
  }, [selectedSpace?.name]);

  const onOpenChange = async (open: boolean) => {
    if (!open) {
      setValue(selectedSpace?.name || '');
    }

    await setOpen(open);

    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const selectSpace = (spaceId: string) => {
    localStorage.setItem(localStorageKey.LAST_SPACE_ID, spaceId);
    setSelectedSpaceId(spaceId);
    setOpen(false);
  };

  const addNewSpace = async () => {
    if (!value) {
      return;
    }

    const newSpace = createNewSpace(spaces, value);

    mutate([...spaces, newSpace]);
    selectSpace(newSpace.id);
  };

  return (
    <Popover
      open={open || isInputFocus}
      onOpenChange={onOpenChange}
    >
      <Command value={value}>
        <CommandList>
          <PopoverTrigger asChild>
            <div
              className={twMerge(
                'flex items-center justify-between rounded bg-white py-1 pl-3 pr-2',
                'truncate text-left text-base leading-normal text-gray-500',
                className,
              )}
            >
              <CommandInput
                className="flex-1 focus:outline-none focus:placeholder:opacity-0"
                placeholder="Select a space"
                title={value}
                value={value}
                onValueChange={(currentValue) => setValue(currentValue)}
                onFocus={() => setIsInputFocus(true)}
                onBlur={() => setIsInputFocus(false)}
                ref={inputRef}
              />
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <CommandEmpty
              className="rounded px-3 py-1.5 hover:bg-indigo-50"
              asChild
            >
              <button
                className="flex w-full items-center justify-between"
                onClick={addNewSpace}
              >
                <span>Add new space</span>
                <PlusIcon className="h-3 w-3" />
              </button>
            </CommandEmpty>

            {spaces.length ? (
              <CommandGroup className="max-h-[50vh] overflow-y-auto">
                {spaces.map((space) => (
                  <CommandItem
                    key={space.id}
                    value={space.name}
                    onSelect={() => {
                      selectSpace(space.id);
                    }}
                    className="hover:bg-indigo-50 aria-selected:bg-indigo-50 data-[disabled]:pointer-events-auto"
                  >
                    {space.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </PopoverContent>
        </CommandList>
      </Command>
    </Popover>
  );
};
