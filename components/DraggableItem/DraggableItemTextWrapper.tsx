import React, { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  title: string;
  url?: string;
}

export const DraggableItemTextWrapper: FC<Props> = ({ url, title, ...props }) => {
  if (!url) {
    return <span {...props}>{title}</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {title}
    </a>
  );
};
