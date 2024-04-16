import React, { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
  url?: string;
}

export const DraggableItemTextWrapper: FC<Props> = ({ url, children, ...props }) => {
  if (!url) {
    return <span {...props}>{children}</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  );
};
