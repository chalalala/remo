import { FC, PropsWithChildren } from 'react';
import { Image } from '../Image';
import { IconButton } from '../IconButton';
import { LinkIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';

interface Props {
  text: string;
  icon?: string;
  url?: string;
}

export const DraggableItem: FC<Props> = ({ text, icon, url }) => {
  const Wrapper = url
    ? ({ children, ...props }: PropsWithChildren) => (
        <a
          href={url}
          {...props}
        >
          {children}
        </a>
      )
    : 'span';

  return (
    <div className="flex min-w-0 items-center gap-2 show-child-on-hover">
      <span className="shrink-0">
        <Image
          src="/svgs/draggable.svg"
          alt="Draggable"
          className="h-4 w-4"
        />
      </span>

      <div className="flex w-full min-w-0 flex-1 items-center justify-between gap-1">
        <div className="flex min-w-0 items-center gap-1">
          <IconButton>
            {url ? (
              <Image
                src={icon || '/svgs/earth.svg'}
                alt={text}
                className="h-4 w-4"
              />
            ) : (
              <LinkIcon className="h-4 w-4" />
            )}
          </IconButton>

          <Wrapper
            className="flex-1 truncate text-sm"
            title={text}
          >
            {text}
          </Wrapper>
        </div>

        <div className="shrink-0 items-center leading-none child">
          <IconButton>
            <PencilIcon className="h-4 w-4" />
          </IconButton>
          <IconButton>
            <TrashIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
