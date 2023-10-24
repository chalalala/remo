import React, { FC, ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
}

export const Image: FC<Props> = ({ alt, ...props }) => {
  return (
    <picture>
      <img
        alt={alt}
        {...props}
      />
    </picture>
  );
};
